const axios = require('axios');

async function runTests() {
    try {
        // Test #1 - Insert two items
        await axios.post('http://localhost:3000/api', {
            title: 'Inception', release_year: '2010', time_viewed: '2024-01-01T10:00:00.000'
        });
        await axios.post('http://localhost:3000/api', {
            title: 'The Matrix', release_year: '1999', time_viewed: '2024-01-02T11:00:00.000'
        });

        // Modify one item
        await axios.put('http://localhost:3000/api/1', {
            title: 'Inception Updated', release_year: '2010', time_viewed: '2024-01-01T10:30:00.000'
        });

        // Check both items
        let res1 = await axios.get('http://localhost:3000/api/1');
        let res2 = await axios.get('http://localhost:3000/api/2');
        console.log('Test 1 Item 1:', res1.data);
        console.log('Test 1 Item 2:', res2.data);

        // Test #2 - Replace collection
        await axios.put('http://localhost:3000/api', [
            { title: 'Gladiator', release_year: '2000', time_viewed: '2024-01-03T12:00:00.000' },
            { title: 'Titanic', release_year: '1997', time_viewed: '2024-01-04T14:00:00.000' },
            { title: 'The Godfather', release_year: '1972', time_viewed: '2024-01-05T16:00:00.000' },
            { title: 'The Dark Knight', release_year: '2008', time_viewed: '2024-01-06T18:00:00.000' }
        ]);

        let allMovies = await axios.get('http://localhost:3000/api');
        console.log('Test 2 Collection:', allMovies.data);

        // Delete a single item
        await axios.delete('http://localhost:3000/api/2');

        let remainingMovies = await axios.get('http://localhost:3000/api');
        console.log('Test 2 After Deletion:', remainingMovies.data);

        // Delete the entire collection
        await axios.delete('http://localhost:3000/api');
        let emptyCollection = await axios.get('http://localhost:3000/api');
        console.log('Test 2 Empty Collection:', emptyCollection.data);

        console.log('ALL TESTS SUCCESSFUL');
    } catch (error) {
        console.error('Test failed:', error.response.data || error.message);
    }
}

runTests();
