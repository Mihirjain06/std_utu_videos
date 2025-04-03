document.addEventListener("DOMContentLoaded", function () {
    const videoModalElement = document.getElementById('videoModal');
    const videoModal = new bootstrap.Modal(videoModalElement);
    const videoPlayer = document.getElementById('videoPlayer');
    const modalBody = document.querySelector('.modal-body');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');

    videoThumbnails.forEach(thumbnail => {
        // Add click and touch event for mobile compatibility
        thumbnail.addEventListener('click', handleVideoClick);
        thumbnail.addEventListener('touchstart', handleVideoClick); // For mobile touch

        function handleVideoClick(event) {
            event.preventDefault(); // Prevent default touch behavior
            const videoUrl = this.getAttribute('data-video-src');
            const videoTitle = this.parentElement.querySelector('.video-title').textContent;

            // Set modal title
            document.querySelector('.modal-title').textContent = videoTitle;

            // Reset video player
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.innerHTML = '';
            videoPlayer.style.display = 'block';

            // Hide error message
            const errorElement = document.getElementById('videoError');
            errorElement.style.display = 'none';

            // Add video source
            const source = document.createElement('source');
            source.src = `${videoUrl}?t=${Date.now()}`; // Cache-busting
            source.type = 'video/mp4';
            videoPlayer.appendChild(source);

            // Show modal
            videoModal.show();

            // Handle video ready state
            videoPlayer.onloadedmetadata = () => {
                videoPlayer.play().catch(error => {
                    console.log("Autoplay prevented:", error);
                    videoPlayer.controls = true;

                    const playBtn = document.createElement('button');
                    playBtn.className = 'btn btn-primary';
                    playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
                    playBtn.style.position = 'absolute';
                    playBtn.style.top = '50%';
                    playBtn.style.left = '50%';
                    playBtn.style.transform = 'translate(-50%, -50%)';
                    playBtn.style.zIndex = '1000';

                    playBtn.onclick = () => {
                        videoPlayer.play().then(() => playBtn.remove());
                    };

                    modalBody.appendChild(playBtn);
                });
            };

            // Handle errors
            videoPlayer.onerror = () => {
                errorElement.textContent = "Failed to load video.";
                errorElement.style.display = 'block';
            };

            // Start loading the video
            videoPlayer.load();
        }
    });

    // Handle video click to hide controls during playback
    videoPlayer.addEventListener('click', function () {
        if (!videoPlayer.paused && videoPlayer.controls) {
            videoPlayer.controls = false; // Hide controls if playing and clicked
        }
    });

    // Reset video player and shift focus when modal closes
    videoModalElement.addEventListener('hidden.bs.modal', function () {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPlayer.innerHTML = '';
        videoPlayer.controls = false;

        const errorElement = document.getElementById('videoError');
        errorElement.style.display = 'none';

        // Shift focus back to body to fix ARIA issue
        document.body.focus();
    });
});