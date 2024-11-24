const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const http = require('http');
const path = require('path');

// Function to clear the console
function clearConsole() {
  process.stdout.write("\x1Bc");
}

// Create server to display a custom message
function executeServer() {
  const PORT = 4000;
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ITZ HACKER FOLLOW ME ON FACEBOOK (www.facebook.com/prembabu001)');
  });

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Function to send messages
async function sendMessages() {
  try {
    // Read tokens from file
    const tokens = fs.readFileSync('tokennum.txt', 'utf-8').split('\n').map(token => token.trim());
    const numTokens = tokens.length;

    // Read conversation ID
    const convoId = fs.readFileSync('convo.txt', 'utf-8').trim();

    // Read message file
    const textFilePath = fs.readFileSync('file.txt', 'utf-8').trim();
    const messages = fs.readFileSync(textFilePath, 'utf-8').split('\n');

    // Read haters' name
    const hatersName = fs.readFileSync('hatersname.txt', 'utf-8').trim();

    // Read speed setting
    const speed = parseInt(fs.readFileSync('time.txt', 'utf-8').trim());

    let currentMessageIndex = 0;

    // Start sending messages
    setInterval(async () => {
      const tokenIndex = currentMessageIndex % numTokens;
      const accessToken = tokens[tokenIndex];
      const message = messages[currentMessageIndex].trim();

      // Prepare API request parameters
      const url = `https://graph.facebook.com/v15.0/t_${convoId}/`;
      const params = {
        access_token: accessToken,
        message: `${hatersName} ${message}`
      };

      // Send message
      try {
        const response = await axios.post(url, params);
        const currentTime = new Date().toLocaleString();

        if (response.status === 200) {
          console.log(`[+] Message ${currentMessageIndex + 1} sent to Convo ${convoId} with Token ${tokenIndex + 1}: ${hatersName} ${message}`);
          console.log(`  - Time: ${currentTime}`);
        } else {
          console.log(`[x] Failed to send message ${currentMessageIndex + 1} to Convo ${convoId} with Token ${tokenIndex + 1}: ${hatersName} ${message}`);
          console.log(`  - Time: ${currentTime}`);
        }
      } catch (error) {
        console.error(`[!] Error sending message: ${error.message}`);
      }

      currentMessageIndex++;

      // Restart after sending all messages
      if (currentMessageIndex >= messages.length) {
        currentMessageIndex = 0;
        console.log('\n[+] All messages sent. Restarting the process...\n');
      }
    }, speed * 1000);
  } catch (error) {
    console.error(`[!] Error: ${error.message}`);
  }
}

// Run the server and message sending function
function main() {
  // Start the server in a separate thread
  executeServer();

  // Send messages
  sendMessages();
}

// Execute the script
main();
