const tweetsToBeClassified = 5;
let tweetsClassified = 0;
let selectedTweetIndex = [];
let classification = [];
// Check proper way to actually create a user ID, maybe ask only for a name and associate a number in db
const participantID = Math.floor(Math.random() * 10000);

//HTML elements
const currentTweet = document.querySelector('.tweet');
const submitButton = document.querySelector('button[type="button"]');
const form = document.querySelector('form');
const container = document.querySelector('.container');

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
        alert("Task complete! Here is the collected data:\n\n" + JSON.stringify(classification, null, 2));
        storeClassification();
    }

}

// Initialize the task when the page loads
selectFiveUniqueTweetIndexes(emotionDataset, tweetsToBeClassified);
displayTweet(emotionDataset, selectedTweetIndex)
//Listen for submit button
submitButton.addEventListener('click', handleSubmitButton);