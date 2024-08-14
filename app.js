const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/test-ddos', async (req, res) => {
    const { url, numRequests } = req.body;
    let responses = [];

    for (let i = 0; i < numRequests; i++) {
        try {
            const response = await axios.get(url);
            responses.push({
                status: response.status,
                data: response.data
            });
        } catch (error) {
            responses.push({ status: error.response?.status || 'Error', message: error.message });
        }
    }

    res.render('index', { responses });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
    
