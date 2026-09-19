const tweetsToBeClassified = 5;
let tweetsClassified = 0;
let selectedTweetIndex = [];
let classification = [];
// Check proper way to actually create a user ID, maybe ask only for a name and associate a number in db
const participantID = "participant_"+Date.now()+"_"+Math.floor(Math.random() * 1000);

//HTML elements
const currentTweet = document.querySelector('.tweet');
const submitButton = document.querySelector('button[type="button"]');
const form = document.querySelector('form');
const container = document.querySelector('.container');
const progressLabel = document.getElementById('progressLabel');

//Select the indexes in the dataset for the unique tweets that must be classified
function selectFiveUniqueTweetIndexes(emotionDataset, tweetsToBeClassified){
    while(selectedTweetIndex.length < tweetsToBeClassified){
        let randomIndex = Math.floor(Math.random() * emotionDataset.length);
        if (!selectedTweetIndex.includes(randomIndex)){
            selectedTweetIndex.push(randomIndex);
        }
    }
}

function displayTweet(emotionDataset){
    let currentIndex = selectedTweetIndex[tweetsClassified];
    let currentTweetText = emotionDataset[currentIndex];
    currentTweet.textContent = `"${currentTweetText}"`;
    progressLabel.textContent = `Tweet ${tweetsClassified+1} of ${tweetsToBeClassified}`;
    form.reset();
}
function storeClassification(){
    fetch('https://hai-interatction-hw1-backend.onrender.com/api/saveClassifiedTweets', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(classification)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error("Error sending data to storage:", error);
        alert("Failed to send data to storage :(")
    })
    }

function handleSubmitButton(){
    const selectedOption = document.querySelector('input[name="emotion"]:checked')
    
    if(!selectedOption) {
        alert("Please select an emotion before submitting classification!");
        return;
    }

    //Get information for index and string of current tweet in selection for user to classify
    let currentIndex = selectedTweetIndex[tweetsClassified];
    let currentTweetString = emotionDataset[currentIndex];
    classification.push({
        user: participantID,
        tweet: currentTweetString,
        emotion: selectedOption.value
    });
    //Move to next tweet for classification
    tweetsClassified++;

    if(tweetsClassified < tweetsToBeClassified){
        displayTweet(emotionDataset);
    } else {
        submitButton.disabled = true;
        //alert("Task complete! Here is the collected data:\n\n" + JSON.stringify(classification, null, 2));
        currentTweet.textContent = "Thank you for completing the task!";
        form.style.display = 'none';
        storeClassification();
    }

}
//Ask for consent to record user responses
const userConsent = confirm("Your responses will be recorded for data labeling purposes. If you do not consent, please click 'Cancel' and close this window.");
if (!userConsent) {
    container.style.display = 'none';
    document.body.innerHTML = '<h2 style="text-align: center; margin-top: 50px; color: #2c3e50;"> You have opted out. You may close this window </h2>';
} else {
    // Initialize the task when the page loads
    selectFiveUniqueTweetIndexes(emotionDataset, tweetsToBeClassified);
    displayTweet(emotionDataset, selectedTweetIndex);
    //Listen for submit button
    submitButton.addEventListener('click', handleSubmitButton);
}