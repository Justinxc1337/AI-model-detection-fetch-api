async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/detections');
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        const detectionsDiv = document.getElementById('detections');
        detectionsDiv.innerHTML = '';
        detectionsDiv.classList.remove('hidden');

        if (data.length === 0) {
            detectionsDiv.innerHTML = '<p>No detections found.</p>';
            return;
        }

        data.forEach(detection => {
            const originalImageUrl = `http://127.0.0.1:5000/static/images/original/${encodeURIComponent(detection.filename)}`;
            const annotatedFilename = detection.filename.replace("alert_knife_detected_", "alert_knife_detected_annotated_");
            const annotatedImageUrl = `http://127.0.0.1:5000/static/images/annotated/${encodeURIComponent(annotatedFilename)}`;

            const detectionElement = document.createElement('div');
            detectionElement.className = 'box';
            detectionElement.innerHTML = `
                <img src="${originalImageUrl}" alt="Original Image">
                <p><strong>Date:</strong> ${detection.date}</p>
                <p><strong>Time:</strong> ${detection.time}</p>
                <p><strong>Company:</strong> ABC Corp</p>
                <p><strong>Location:</strong> Entrance</p>
            `;
            detectionsDiv.appendChild(detectionElement);
        });
    } catch (error) {
        console.error('Error fetching detections:', error);
        document.getElementById('detections').innerHTML = '<p style="color:red;">Failed to load detections.</p>';
    }
}
