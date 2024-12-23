import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [candidates, setCandidates] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        axios.get('http://localhost:5000/api/candidates')
            .then(response => setCandidates(response.data))
            .catch(error => console.error('Error fetching candidates:', error));
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = () => {
        const sorted = [...candidates].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.yearsOfExperience - b.yearsOfExperience
                : b.yearsOfExperience - a.yearsOfExperience;
        });
        setCandidates(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="container">
            <h1>Candidate List</h1>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by Name or Skills"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <button onClick={handleSort} className="sort-button">
                    Sort by Experience ({sortOrder})
                </button>
            </div>
            <table className="candidate-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Skills</th>
                        <th>Experience</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate, index) => (
                            <tr key={index}>
                                <td>{candidate.name}</td>
                                <td>{candidate.skills.join(', ')}</td>
                                <td>{candidate.yearsOfExperience} years</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-data">
                                No candidates found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default App;
