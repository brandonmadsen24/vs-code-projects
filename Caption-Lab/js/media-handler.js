// MediaHandler - Handles file upload and preview
class MediaHandler {
    constructor() {
        this.uploadedFile = null;
        this.fileType = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const dropArea = document.getElementById('drop-area');
        const fileInput = document.getElementById('file-input');

        // Click to upload
        dropArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Prevent defaults for drag and drop
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults);
        });

        // Highlight drop area when dragging over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.classList.remove('dragover');
            });
        });

        // Handle drop
        dropArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Handle file input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    handleFile(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload jpg, png, webp, or mp4.');
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('File too large. Maximum size is 10MB.');
            return;
        }

        // Store file info
        this.uploadedFile = file;
        this.fileType = file.type.startsWith('image') ? 'image' : 'video';

        // Show preview
        this.showPreview(file);

        // Enable generate button
        document.getElementById('generate-btn').disabled = false;
    }

    showPreview(file) {
        const preview = document.getElementById('media-preview');
        const dropPrompt = document.querySelector('.drop-prompt');

        // Hide prompt, show preview
        dropPrompt.classList.add('hidden');
        preview.classList.remove('hidden');
        preview.innerHTML = '';

        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.fileType === 'image') {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded media preview';
                preview.appendChild(img);
            } else if (this.fileType === 'video') {
                const video = document.createElement('video');
                video.src = e.target.result;
                video.controls = true;
                video.style.maxWidth = '100%';
                preview.appendChild(video);
            }
        };
        reader.readAsDataURL(file);
    }

    getFileData() {
        return {
            file: this.uploadedFile,
            type: this.fileType,
            name: this.uploadedFile?.name || 'unknown'
        };
    }

    reset() {
        this.uploadedFile = null;
        this.fileType = null;

        const preview = document.getElementById('media-preview');
        const dropPrompt = document.querySelector('.drop-prompt');
        const fileInput = document.getElementById('file-input');

        preview.classList.add('hidden');
        preview.innerHTML = '';
        dropPrompt.classList.remove('hidden');
        fileInput.value = '';

        document.getElementById('generate-btn').disabled = true;
    }
}
