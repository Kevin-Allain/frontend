import axios from 'axios';

// module.export.create = ({
//     baseUrl: 'http://localhost:5000'
// });

export default axios.create = ({
    baseUrl: 'http://localhost:5000'
    // post: axios.post,
    // get: axios.get
});
