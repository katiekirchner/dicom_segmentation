import numpy as np

import pydicom
from skimage.color import rgb2gray

import os
import pyvista as pv

from glob import glob

import skimage.segmentation as seg
import pandas as pd
import matplotlib.pyplot as plt
from skimage.morphology import watershed
from skimage.feature import peak_local_max
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import scipy.ndimage
from skimage import morphology
from skimage import measure
from sklearn.cluster import KMeans
from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
from plotly import figure_factory as FF
from skimage.measure import label, regionprops, regionprops_table
from scipy import ndimage, misc





def standardise_labels_timeline(images_list, start_at_end = True, count_offset = 1000):
    """
    Replace labels on similar images to allow tracking over time

    :param images_list: a list of segmented and lablled images as numpy arrays
    :param start_at_end: relabels the images beginning at the end of the list
    :param count_offset: an int greater than the total number of expected labels in a single image
    :returns: a list of relablled images as numpy arrays
    """

    images = list(images_list)
    if start_at_end:
        images.reverse()

    # Relabel all images to ensure there are no duplicates
    for image in images:
        for label in np.unique(image):
            if label > 0:
                count_offset += 1
                image[image == label] = count_offset

    # Ensure labels are propagated through image timeline
    for i, image in enumerate(images):
        labels = get_labelled_centers(image)

        # Apply labels to all subsequent images
        for j in range(i, len(images)):
            images[j] = replace_image_point_labels(images[j], labels)

    if start_at_end:
        images.reverse()

    return images


def get_labelled_centers(image):
    """
    Builds a list of labels and their centers

    :param image: a segmented and labelled image as a numpy array
    :returns: a list of label, co-ordinate tuples
    """

    # Find all labelled areas, disable caching so properties are only calculated if required
    rps = measure.regionprops(image, cache = False)

    return [(r.label, r.centroid) for r in rps]


def replace_image_point_labels(image, labels):
    """
    Replace the labelled at a list of points with new labels

    :param image: a segmented and lablled image as a numpy array
    :param labels: a list of label, co-ordinate tuples
    :returns: a relabelled image as a numpy array
    """
    img = image.copy()
    for label, point in labels:
        row, col = point
        # Find the existing label at the point
        index = img[int(row), int(col)]
        # Replace the existing label with new, excluding background
        if index > 0:
            img[img == index] = label

    return img








def make_mesh(image, threshold, step_size):

    print
    "Transposing surface"
    p = image.transpose(2, 1, 0)

    print
    "Calculating surface"
    verts, faces, norm, val = measure.marching_cubes_lewiner(p, threshold, step_size=step_size, allow_degenerate=True)
    return verts, faces




def plotly_3d(verts, faces):
    x, y, z = zip(*verts)

    print
    "Drawing"

    # Make the colormap single color since the axes are positional not intensity.
    #    colormap=['rgb(255,105,180)','rgb(255,255,51)','rgb(0,191,255)']
    colormap = ['rgb(236, 236, 212)', 'rgb(236, 236, 212)']

    fig = FF.create_trisurf(x=x,
                            y=y,
                            z=z,
                            plot_edges=False,
                            colormap="Viridis",
                            simplices=faces,
                            backgroundcolor='rgb(64, 64, 64)',
                            title="Interactive Visualization")
    iplot(fig)





def plt_3d(verts, faces):
    print
    "Drawing"
    x, y, z = zip(*verts)
    fig = plt.figure(figsize=(10, 10))
    ax = fig.add_subplot(111, projection='3d')

    # Fancy indexing: `verts[faces]` to generate a collection of triangles
    mesh = Poly3DCollection(verts[faces], linewidths=0.05, alpha=1)
    face_color = [1, 1, 0.9]
    mesh.set_facecolor(face_color)
    ax.add_collection3d(mesh)

    ax.set_xlim(0, max(x))
    ax.set_ylim(0, max(y))
    ax.set_zlim(0, max(z))
    ax.set_facecolor((0.7, 0.7, 0.7))
    plt.show()








def load_scan(path):
    slices = [pydicom.read_file(path + '/' + s) for s in os.listdir(path)]
    slices.sort(key=lambda x: int(x.InstanceNumber))
    try:
        slice_thickness = np.abs(slices[0].ImagePositionPatient[2] - slices[1].ImagePositionPatient[2])
    except:
        slice_thickness = np.abs(slices[0].SliceLocation - slices[1].SliceLocation)

    for s in slices:
        s.SliceThickness = slice_thickness

    return slices





def get_pixels_hu(scans):
    image = np.stack([s.pixel_array for s in scans])
    # Convert to int16 (from sometimes int16),
    # should be possible as values should always be low enough (<32k)
    image = image.astype(np.int16)

    # Set outside-of-scan pixels to 1
    # The intercept is usually -1024, so air is approximately 0
    image[image == -2000] = 0

    # Convert to Hounsfield units (HU)
    intercept = scans[0].RescaleIntercept
    slope = scans[0].RescaleSlope

    if slope != 1:
        image = slope * image.astype(np.float64)
        image = image.astype(np.int16)

    image += np.int16(intercept)

    return np.array(image, dtype=np.int16)




def sample_stack(stack, show_every):
    rows = 6
    cols = 6
    start_with = 95

    fig,ax = plt.subplots(rows,cols,figsize=[10,12])
    for i in range(rows*cols):
        ind = start_with + i*show_every
        ax[int(i/rows),int(i % rows)].set_title('slice %d' % ind)
        ax[int(i/rows),int(i % rows)].imshow(stack[ind], cmap='nipy_spectral')
        # ax[int(i/rows),int(i % rows)].imshow(stack[ind],cmap='gray')
        ax[int(i/rows),int(i % rows)].axis('off')
    fig.tight_layout()
    plt.show()






def resample(image, scan, new_spacing=[1, 1, 1]):
    # Determine current pixel spacing
    spacing = map(float, ([scan[0].SliceThickness] + list(scan[0].PixelSpacing)))
    spacing = np.array(list(spacing))

    resize_factor = spacing / new_spacing
    new_real_shape = image.shape * resize_factor
    new_shape = np.round(new_real_shape)
    real_resize_factor = new_shape / image.shape
    new_spacing = spacing / real_resize_factor

    image = scipy.ndimage.interpolation.zoom(image, real_resize_factor)

    return image, new_spacing








def segmentation2d(image, display=False):

    threshold = np.mean(image)
    thresh_img = np.where(image < threshold, 0.0, 1.0)  # threshold the image

    eroded = morphology.erosion(thresh_img, np.ones([4, 4]))
    dilation = morphology.dilation(eroded, np.ones([4, 4]))

    distance = ndimage.distance_transform_edt(dilation)


    segment = seg.felzenszwalb(thresh_img, scale=5.0, sigma=0.5, min_size=20)
    labels = measure.label(segment, background=0)
    wShed = watershed(-distance, labels, mask=thresh_img)



    eroded2 = morphology.erosion(dilation, np.ones([2, 2]))
    finalCleaned = morphology.dilation(eroded2, np.ones([2, 2]))

    # regions = measure.regionprops(labels)



    # for region in regions:
    #     print('Label: {} >> Object size: {}'.format(region.label, region.area))
    #
    # props = regionprops_table(labels, properties=('centroid',
    #                                                  'orientation',
    #                                                  'major_axis_length',
    #                                                  'minor_axis_length',
    #                                                     'area'))
    #
    # print(pd.DataFrame(props))



    if (display):

        fig, ax = plt.subplots(3, 3, figsize=[10, 8])
        ax[0, 0].set_title("Original")
        ax[0, 0].imshow(image)
        ax[0, 0].axis('off')

        ax[0, 1].set_title("Threshold")
        ax[0, 1].imshow(thresh_img)
        ax[0, 1].axis('off')

        ax[0, 2].set_title("Erosion/Dilation")
        ax[0, 2].imshow(dilation)
        ax[0, 2].axis('off')

        ax[1, 0].set_title("Distance Map")
        ax[1, 0].imshow(distance)
        ax[1, 0].axis('off')

        ax[1, 1].set_title("Intial Segment")
        ax[1, 1].imshow(segment)
        ax[1, 1].axis('off')

        ax[1, 2].set_title("Labels")
        ax[1, 2].imshow(labels)
        ax[1, 2].axis('off')

        ax[2, 0].set_title("Watershed")
        ax[2, 0].imshow(wShed, cmap='nipy_spectral')
        ax[2, 0].axis('off')

        ax[2, 1].set_title("Final Cleaned")
        ax[2, 1].imshow(finalCleaned)
        ax[2, 1].axis('off')

        ax[2, 2].set_title("Final Cleaned * Watershed")
        ax[2, 2].imshow(finalCleaned * wShed, cmap='nipy_spectral')
        ax[2, 2].axis('off')

        fig.tight_layout()
        plt.show()


    return finalCleaned * wShed, labels




def plotFourImgs(one, two, three, four):
    fig, ax = plt.subplots(2, 2, figsize=[10, 8])
    ax[0, 0].set_title("1")
    ax[0, 0].imshow(one)
    ax[0, 0].axis('off')


    ax[0, 1].set_title("2")
    ax[0, 1].imshow(two)
    ax[0, 1].axis('off')

    ax[1, 0].set_title("3")
    ax[1, 0].imshow(three)
    ax[1, 0].axis('off')


    ax[1, 1].set_title("4")
    ax[1, 1].imshow(four)
    ax[1, 1].axis('off')

    fig.tight_layout()
    plt.show()








def renderSTL(path):
    p = pv.Plotter()

    mesh = pv.PolyData(path)

    p.add_mesh(mesh)
    p.show()

    # mesh.plot()










def start():

    data_path = "path to dicom folder/"

    output_path = working_path = "some output path/"
    g = glob(data_path + '/*.dcm')


    id = 0 #change
    patient = load_scan(data_path)
    imgs = get_pixels_hu(patient)

    np.save(output_path + "fullimages_%d.npy" % (id), imgs)

    file_used = output_path + "fullimages_%d.npy" % id
    imgs_to_process = np.load(file_used).astype(np.float64)

    # imgs_to_process = np.load(output_path + '1fullimages_{}.npy'.format(id))

    sample_stack(imgs_to_process, 10)


    plt.hist(imgs_to_process.flatten(), bins=50, color='c')
    plt.xlabel("Hounsfield Units (HU)")
    plt.ylabel("Frequency")
    plt.show()

    print("Slice Thickness: %f" % patient[0].SliceThickness)
    print("Pixel Spacing (row, col): (%f, %f) " % (patient[0].PixelSpacing[0], patient[0].PixelSpacing[1]))
    print("Shape before resampling\t", imgs_to_process.shape)

    imgs_after_resamp, spacing = resample(imgs_to_process, patient, [1, 1, 1])

    print("Shape after resampling\t", imgs_after_resamp.shape)


    sample_stack(imgs_after_resamp, 10)



    # print("Max: ", ndimage.maximum(seg))
    # print("Min: ", ndimage.minimum(seg))
    # print("Mean: ", ndimage.mean(seg))
    # print("StDev: ", ndimage.standard_deviation(seg))
    # print("Extreme: ", ndimage.extrema(seg))






    segment_all = []
    label_all = []


    for img in imgs_after_resamp:
        img = np.clip(img, -50, std)

        mask, regions = segmentation2d(img, True)
        segment_all.append(mask)
        label_all.append(regions)

    sample_stack(segment_all, 10)


    tracked_centriods = standardise_labels_timeline(label_all)


    np.save(output_path + "segment_all.npy", segment_all)
    np.save(output_path + "tracked_centriods.npy", tracked_centriods)




    v, f = make_mesh(seg, 40, 2)
    ptly_3d(v, f)





if __name__ == '__main__':
    start()









# def segmentation3d(image, display=False):
#
#     threshold = np.mean(image)
#     thresh_img = np.where(image < threshold, 0.0, 1.0)  # threshold the image
#
#     erodedt = morphology.erosion(image, np.ones([10, 10, 10]))
#
#     eroded = morphology.erosion(thresh_img, np.ones([10, 10, 10]))
#     # dilation = morphology.dilation(eroded, np.ones([4, 4, 4]))
#
#     distance = ndimage.distance_transform_edt(eroded)
#
#     localMax = peak_local_max(distance, indices=False, min_distance=30,threshold_abs=9,exclude_border=1)
#
#
#     # segment = seg.felzenszwalb(thresh_img, scale=5.0, sigma=0.5, min_size=20)
#     labels = measure.label(localMax, background=0)
#     wShed = watershed(-distance, labels, mask=thresh_img)
#
#
#     regions = measure.regionprops(wShed)
#
#     eroded2 = morphology.erosion(eroded, np.ones([2, 2, 2]))
#     finalCleaned = morphology.dilation(eroded2, np.ones([2, 2, 2]))
#
#     # for region in regions:
#     #     print('Region: {} >> Region size: {}'.format(region.label, region.area))
#
#     # for label in labels:
#     #     print('Label: {}'.format(label.label))
#
#     print("here")
#
#     plotter = pv.Plotter(shape='1|1',window_size=(1000, 1200))
#     p = pv.wrap(erodedt)
#     plotter.subplot(0)
#     plotter.add_text(" 1 ")
#     plotter.add_volume(p, shade=True)
#
#     plotter.subplot(1)
#     p2 = pv.wrap(eroded)
#     plotter.add_text(" 2 ")
#     plotter.add_volume(p2, shade=True)
#
#     plotter.show()
#
#
#
#     return finalCleaned * wShed
