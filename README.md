# Image Dataset Tagging Application

**A streamlined web application for conveniently tagging image datasets.**

## Description 

This web application simplifies image tagging workflows, particularly as used in image dataset preparation for tasks like Stable Diffusion training. With its user-friendly interface, you can swiftly associate text descriptions (captions) with your uploaded image files.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/markuryy/image-dataset-tagger)

## Features

* **Image Upload:** Easily upload your image dataset via the file selector.
* **Automatic Caption Pairing:** Automatically matches image captions from `.txt` files with the same base filename (e.g., "dog.png" will search for "dog.txt").
* **Tag Management:** Imports tags from text files and displays them as clickable buttons for fast tagging.
* **Seamless Navigation:** Cycle through images with intuitive previous/next buttons.
* **Data Export:**  Exports your image dataset along with the assigned caption files in a ZIP file.

## Usage

1. **Upload Images:** Click the "Import Images" button and select your dataset images. 
2. **Assign Captions:**
   * Corresponding  `.txt` caption files (if found) will be loaded automatically.
   * Click imported tags to add them to an image's description.
3. **Navigate:** Use the image navigation buttons to browse through images, with captions updating accordingly.
4. **Export:** Generate a downloadable ZIP file containing your images and their captions by clicking "Export Data".

## Technical Details

* **Built with:**  JavaScript, HTML, CSS 
* **Optional Libraries:** Tailwind CSS, DaisyUI, JSZip 

## Notes

* **Not optimized for mobile devices.**

## Installation

You can try it here: [Vercel](https://image-dataset-tagger.vercel.app/)

For local use:

1. Clone this repository: `git clone https://github.com/markuryy/image-dataset-tagger`
2. Open the `index.html` file in a web browser.

## Contributing

Open to improvements! If you have ideas or find bugs, please:

* Open an issue with your suggestion or bug report.
* Create a pull request if you've made direct improvements.
