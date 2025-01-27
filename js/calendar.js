document.addEventListener('DOMContentLoaded', async () => {
    const calendarDiv = document.getElementById('calendar');
    const currentYear = new Date().getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Fetch detections data
    const detections = await fetchDetections();

    // Check if detections data is fetched correctly
    console.log('Detections:', detections);

    // Create a map to store detections count by date
    const detectionsMap = new Map();
    detections.forEach(detection => {
        const dateParts = detection.date.split(' ');
        if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            const date = new Date(`${year}-${month}-${day}`);
            if (isNaN(date)) {
                console.error('Invalid date:', detection.date);
                return;
            }
            // Subtract one day from the date
            date.setDate(date.getDate() - 1);
            const dateString = date.toISOString().split('T')[0];
            if (detectionsMap.has(dateString)) {
                detectionsMap.set(dateString, detectionsMap.get(dateString) + 1);
            } else {
                detectionsMap.set(dateString, 1);
            }
        } else {
            console.error('Invalid date format:', detection.date);
        }
    });

    // Check if detectionsMap is populated correctly
    console.log('Detections Map:', detectionsMap);

    // Generate calendar
    for (let month = 0; month < 12; month++) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';
        const monthTitle = document.createElement('h2');
        monthTitle.innerText = monthNames[month];
        monthDiv.appendChild(monthTitle);

        const daysDiv = document.createElement('div');
        daysDiv.className = 'days';

        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, month, day).toISOString().split('T')[0];
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.innerHTML = `<span class="date-number">${day}</span>`;

            if (detectionsMap.has(date)) {
                dayDiv.classList.add('red');
                const countSpan = document.createElement('span');
                countSpan.className = 'count';
                countSpan.innerText = detectionsMap.get(date);
                dayDiv.appendChild(countSpan);
            }

            daysDiv.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysDiv);
        calendarDiv.appendChild(monthDiv);
    }
});

async function fetchDetections() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/detections');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching detections:', error);
        return [];
    }
}