document.addEventListener("DOMContentLoaded", function () {
    const videoModalElement = document.getElementById('videoModal');
    const videoModal = new bootstrap.Modal(videoModalElement);
    const videoPlayer = document.getElementById('videoPlayer');
    const modalBody = document.querySelector('.modal-body');
    const playIcons = document.querySelectorAll('.play-icon'); // Target play icons instead

    playIcons.forEach(icon => {
        icon.addEventListener('click', handleVideoClick);
        icon.addEventListener('touchstart', handleVideoClick); // For mobile touch

        function handleVideoClick(event) {
            event.preventDefault(); // Prevent default touch behavior
            const thumbnail = this.closest('.video-thumbnail'); // Find parent thumbnail
            const videoUrl = thumbnail.getAttribute('data-video-src');
            const videoTitle = thumbnail.parentElement.querySelector('.video-title').textContent;

            document.querySelector('.modal-title').textContent = videoTitle;
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.innerHTML = '';
            videoPlayer.style.display = 'block';

            const errorElement = document.getElementById('videoError');
            errorElement.style.display = 'none';

            const source = document.createElement('source');
            source.src = `${videoUrl}?t=${Date.now()}`;
            source.type = 'video/mp4';
            videoPlayer.appendChild(source);

            videoModal.show();

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

            videoPlayer.onerror = () => {
                errorElement.textContent = "Failed to load video.";
                errorElement.style.display = 'block';
            };

            videoPlayer.load();
        }
    });

    // Hide controls on video click during playback
    videoPlayer.addEventListener('click', function () {
        if (!videoPlayer.paused && videoPlayer.controls) {
            videoPlayer.controls = false;
        }
    });

    // Reset and manage focus when modal closes
    videoModalElement.addEventListener('hidden.bs.modal', function () {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPlayer.innerHTML = '';
        videoPlayer.controls = false;

        const errorElement = document.getElementById('videoError');
        errorElement.style.display = 'none';

        const firstThumbnail = document.querySelector('.video-thumbnail');
        if (firstThumbnail) {
            firstThumbnail.focus();
        } else {
            document.body.focus();
        }
    });
});