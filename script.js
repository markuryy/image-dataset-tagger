document.addEventListener('DOMContentLoaded', function () {
  const importImagesButton = document.getElementById('import-images');
  const imageInput = document.getElementById('image-input');
  const importTagsButton = document.getElementById('import-tags');
  const tagsInput = document.getElementById('tags-input');
  const imagePreviews = document.getElementById('image-previews');
  const currentImage = document.getElementById('current-image');
  const imageCaption = document.getElementById('image-caption');
  const tagButtons = document.getElementById('tag-buttons');
  const exportDataButton = document.getElementById('export-data');
  const deleteButton = document.getElementById('clear-all');
  const nextImage = document.getElementById('next-image');
  const prevImage = document.getElementById('prev-image');

  let images = [];
  let captions = {};

  function resetUI() {
    imagePreviews.innerHTML = '';
    tagButtons.innerHTML = '';
    currentImage.src = '';
    currentImage.alt = 'No image selected';
    imageCaption.value = '';
    captions = {};
  }

  function addImageToSidebar(file, index) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'rounded overflow-hidden';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.dataset.index = index;
    img.className = 'object-cover w-full h-full';
    img.onclick = () => {
      displayImage(index);
      loadCaption(index);
    };

    imgContainer.appendChild(img);
    document.querySelector('#image-previews').appendChild(imgContainer);
  }

  function displayImage(index) {
    if (index < 0 || index >= images.length || !images[index]) { // Check if image exists
      return; // Do nothing if the image is invalid
    }

    const file = images[index]; 
    currentImage.src = URL.createObjectURL(file);
    currentImage.dataset.index = index;
    loadCaption(index);
    updateProgressBar(index + 1, images.length);
  }

  deleteButton.onclick = () => {
    const index = parseInt(currentImage.dataset.index || '-1');
    if (index !== -1) {
      // ... (Remove image from the sidebar) ...

      delete images[index];
      images = images.filter((image) => image); // Clear out undefined elements
      delete captions[`image_${index + 1}`];

      // Adjust for deletion:
      let newIndex = Math.min(index, images.length - 1); // Account for the image being removed
      if (newIndex === -1) {
        resetUI();
      } else {
        displayImage(newIndex);
      }
    }
  };


  function loadCaption(index) {
    imageCaption.value = captions[`image_${index + 1}`] || '';
  }

  function saveCaption() {
    if (currentImage.dataset.index !== undefined) {
      const index = parseInt(currentImage.dataset.index, 10);
      captions[`image_${index + 1}`] = imageCaption.value;
    }
  }

  function navigateImages(direction) {
    const index = parseInt(currentImage.dataset.index || '0', 10);

    saveCaption(); // Auto-save before switching

    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      displayImage(newIndex);
    }
  }

  function exportData() {
    const zip = new JSZip();
    images.forEach((file, index) => {
      const fileName = `image_${index + 1}${file.name.substring(
        file.name.lastIndexOf('.')
      )}`;
      zip.file(fileName, file);
      const captionText = captions[`image_${index + 1}`] || '';
      zip.file(`image_${index + 1}.txt`, captionText);
    });

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'captioned_images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  importImagesButton.onclick = () => imageInput.click();
  imageInput.onchange = function (e) {
    Array.from(e.target.files).forEach((file, index) => {
      const newIndex = images.length + 1;
      const renamedFile = new File(
        [file],
        `image_${newIndex}${file.name.substring(file.name.lastIndexOf('.'))}`,
        { type: file.type }
      );
      images.push(renamedFile);
      addImageToSidebar(renamedFile, images.length - 1);
    });
    if (images.length === e.target.files.length) displayImage(0);
  };

  function addTag(tag) {
    let value = imageCaption.value;

    // Remove extra comma and space at the end (if any)
    value = value.replace(/,? +$/, '');

    // Remove the tag if it exists anywhere in the caption
    const tagPattern = new RegExp(`,? +${tag}(,|$)`, 'gi');
    value = value.replace(tagPattern, '');

    // Add the tag with a comma and space
    imageCaption.value = value + (value ? ', ' : '') + tag;
  }

  importTagsButton.onclick = () => tagsInput.click();
  tagsInput.onchange = function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const tags = event.target.result.split('\n');
      tagButtons.innerHTML = '';
      tags.forEach((tag) => {
        if (tag.trim()) {
          const button = document.createElement('button');
          button.textContent = tag.trim();
          button.className =
            'badge badge-outline cursor-pointer hover:bg-gray-700 hover:text-white';
          button.onclick = () => {
            addTag(tag.trim());
          };
          tagButtons.appendChild(button);
        }
      });
    };
    reader.readAsText(file);
  };

  nextImage.onclick = () => navigateImages(1);
  prevImage.onclick = () => navigateImages(-1);

  deleteButton.onclick = () => {
    const index = parseInt(currentImage.dataset.index || '-1');
    if (index !== -1) {
      // Remove the image from the sidebar
      imagePreviews.querySelectorAll('img')[index].parentElement.remove();

      delete images[index];
      images = images.filter((image) => image); // Clear out undefined elements
      delete captions[`image_${index + 1}`];

      let newIndex = Math.min(index, images.length - 1);
      if (newIndex === -1) {
        resetUI();
      } else {
        displayImage(newIndex);
      }
    }
  };

  imageInput.onchange = function (e) {
    const files = Array.from(e.target.files);
    const readPromises = [];

    files.forEach((file) => {
        if (file.type.startsWith('image/')) {
            // Process image files as before
            const newIndex = images.length;
            images.push(file); // Assuming you will adjust this for your renaming logic
            addImageToSidebar(file, newIndex);
        } else if (file.type === 'text/plain') {
            // Read text files and store captions using Promises
            const promise = new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const baseFilename = file.name.substring(0, file.name.lastIndexOf('.'));
                    // Find the image that matches this caption
                    const imageIndex = images.findIndex(img => img.name.startsWith(baseFilename));
                    if (imageIndex !== -1) {
                        captions[`image_${imageIndex + 1}`] = event.target.result;
                    }
                    resolve();
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
            readPromises.push(promise);
        }
    });

    Promise.all(readPromises).then(() => {
        if (images.length) {
            // After all captions are loaded, display the first image
            displayImage(0);
        }
    });
};


  exportDataButton.onclick = () => {
    exportData(); // Auto-save any changes before export
    saveCaption();
  };

  function updateProgressBar(currentIndex, totalImages) {
    document.querySelector('.progress').value = currentIndex;
    document.querySelector('.progress').max = totalImages;

    const counterElement = document.getElementById('image-counter');
    if (counterElement) {
      counterElement.textContent = `Image ${currentIndex} of ${totalImages}`;
    }
  }
});
