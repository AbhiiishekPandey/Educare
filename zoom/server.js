// Add this script to the HTML above (replace the basic implementation)

document.addEventListener('DOMContentLoaded', function() {
    // ... keep previous DOM elements ...
    
    createMeetingBtn.addEventListener('click', async function() {
        const topic = document.getElementById('meetingTopic').value || 'Team Meeting';
        const date = document.getElementById('meetingDate').value;
        const time = document.getElementById('meetingTime').value;
        const duration = document.getElementById('meetingDuration').value;
        
        if (!date || !time) {
            alert('Please select date and time');
            return;
        }
        
        try {
            // Call your backend API to create a Zoom meeting
            const response = await fetch('/api/create-zoom-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    start_time: `${date}T${time}:00`,
                    duration: parseInt(duration),
                    type: 2 // Scheduled meeting
                })
            });
            
            const meetingData = await response.json();
            
            if (meetingData.error) {
                throw new Error(meetingData.error);
            }
            
            const dateObj = new Date(meetingData.start_time);
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            document.getElementById('displayTopic').textContent = meetingData.topic;
            document.getElementById('displayTime').textContent = dateObj.toLocaleDateString('en-US', options);
            document.getElementById('displayDuration').textContent = meetingData.duration;
            document.getElementById('meetingLink').href = meetingData.join_url;
            document.getElementById('meetingId').textContent = meetingData.id;
            document.getElementById('meetingPassword').textContent = meetingData.password || 'None';
            
            scheduleForm.classList.add('hidden');
            meetingDetails.classList.remove('hidden');
        } catch (error) {
            console.error('Error creating meeting:', error);
            alert('Failed to create meeting: ' + error.message);
        }
    });
    
    // Similar implementation for instant meeting
    startBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('/api/create-zoom-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: 'Instant Meeting',
                    type: 1 // Instant meeting
                })
            });
            
            const meetingData = await response.json();
            
            if (meetingData.error) {
                throw new Error(meetingData.error);
            }
            
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            document.getElementById('displayTopic').textContent = meetingData.topic;
            document.getElementById('displayTime').textContent = now.toLocaleDateString('en-US', options);
            document.getElementById('displayDuration').textContent = '60';
            document.getElementById('meetingLink').href = meetingData.join_url;
            document.getElementById('meetingId').textContent = meetingData.id;
            document.getElementById('meetingPassword').textContent = meetingData.password || 'None';
            
            scheduleForm.classList.add('hidden');
            meetingDetails.classList.remove('hidden');
        } catch (error) {
            console.error('Error creating meeting:', error);
            alert('Failed to start meeting: ' + error.message);
        }
    });
});