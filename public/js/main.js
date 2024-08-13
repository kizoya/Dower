document.addEventListener('DOMContentLoaded', function() {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const fetchButton = document.getElementById('fetch');

    dropdownButton.addEventListener('click', function() {
        dropdownMenu.classList.toggle('hidden');
    });

    fetchButton.addEventListener('click', async function() {
        const url = document.getElementById('url').value;
        const platform = document.getElementById('platform').value;
        
        try {
            let response;
            if (platform === 'tiktok') {
                response = await fetch('/api/tiktok/info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
            } else if (platform === 'youtube') {
                response = await fetch('/api/youtube/info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
            }
            
            const data = await response.json();
            
            // Update UI with video info
            document.getElementById('video-info').classList.remove('hidden');
            document.getElementById('download-options').classList.remove('hidden');
            
            // Update UI elements with actual data from the response
            // This will depend on the structure of the response from each API
            // You'll need to adjust this based on the actual response structure
            
            // Add download options
            const mp4Options = document.getElementById('mp4-options');
            mp4Options.innerHTML = `
                <button onclick="downloadVideo('${url}', 'video')" class="w-full bg-green-500 text-black font-bold py-2 px-4 rounded mb-2 hover:bg-green-600 transition duration-300">
                    Download MP4 (High Quality)
                </button>
            `;
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching video info');
        }
    });
});

async function downloadVideo(url, format) {
    try {
        const platform = document.getElementById('platform').value;
        let response;
        if (platform === 'tiktok') {
            response = await fetch('/api/tiktok/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
        } else if (platform === 'youtube') {
            response = await fetch('/api/youtube/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, format })
            });
        }
        
        const data = await response.json();
        
        // Redirect to download URL
        window.location.href = data.downloadUrl;
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while trying to download the video');
    }
}
