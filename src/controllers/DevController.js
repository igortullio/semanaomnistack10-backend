const axios = require('axios');
const https = require('https');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray').parseStringAsArray;
const { findConnections, sendMessage } = require('../websocket');

async function index (request, response) {
    const devs = await Dev.find();
    return response.json(devs);
}

async function store (request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne( { github_username } );

    if (!dev) {
        const agent = https.Agent({  
            rejectUnauthorized: false
        });
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`, { httpsAgent: agent });
        const {name = login, avatar_url, bio } = apiResponse.data;
    
        const techsArray = parseStringAsArray(techs)
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
    
        dev = await Dev.create({
            github_username,
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location
        })

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      )
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }
    return response.json(dev);
}

module.exports = { index, store }