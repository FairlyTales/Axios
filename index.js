import axios from "axios/";

const urlDefault = "https://jsonplaceholder.typicode.com";
const urlTodos = "https://jsonplaceholder.typicode.com/todos";
const urlPosts = "https://jsonplaceholder.typicode.com/posts";
const urlTodosId = "https://jsonplaceholder.typicode.com/todos/1";
const urlInvalid = "https://jsonplaceholder.typicode.com/SOME_INVALID_URL";

// AXIOS GLOBALS
// we can put stuff into axios.defaults to add them to ALL the requests we make
// here we will add a global auth token header
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// GET REQUEST
async function getTodos() {
  const response = await axios({
    method: "get",
    url: urlTodos,
    // params will add the specified params to the url with '?' symbol
    // it's a nicer way to use queries
    params: {
      _limit: 5,
    },
  }).catch((e) => console.log(`ERROR: ${e.message}`));

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// we can also use axios.get(url) to shorten the code:
// we can even shorten it to just 'axios(url)', but it's less clean
async function getTodos1() {
  const response = await axios
    .get(urlTodos, {
      params: {
        _limit: 5,
      },
    })
    .catch((e) => console.log(`ERROR: ${e.message}`));

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// POST REQUEST
async function addTodo() {
  const response = await axios.post(urlTodos, {
    title: "new todo",
    completed: false,
  });

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// PUT/PATCH REQUEST
async function updateTodo() {
  // put - rewrites everything
  // patch - just adds/replaces new info
  const response = await axios
    .patch(urlTodosId, {
      title: "updated todo",
      completed: true,
    })
    .catch((e) => console.log(`ERROR: ${e.message}`));

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// DELETE REQUEST
async function removeTodo() {
  const response = await axios
    .delete(urlTodosId)
    .catch((e) => console.log(`ERROR: ${e.message}`));

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// SIMULTANEOUS DATA
async function getData() {
  // axios.all() takes in an array of requests and returns
  // an array of responses
  const response = await axios
    .all([
      axios.get(urlTodos, {
        params: {
          _limit: 2,
        },
      }),
      axios.get(urlPosts, {
        params: {
          _limit: 2,
        },
      }),
    ])
    .catch((e) => console.log(`ERROR: ${e.message}`));

  for (const res of response) {
    try {
      showOutput(res);
    } catch (e) {
      console.log(`ERROR:\n${e}`);
    }
  }
}

// CUSTOM HEADERS
// we can add custom headers to the requests via config object passed to axios
async function useCustomHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "someToken",
    },
  };

  const response = await axios.post(
    urlTodos,
    {
      title: "new todo",
      completed: false,
    },
    config
  );

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// TRANSFORMING REQUESTS & RESPONSES
async function transformResponse() {
  // we can use 'transformResponse' key to set the transformations we want to
  // perform on a response
  const options = {
    method: "post",
    url: urlTodos,
    data: {
      title: "using transform response",
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };

  const response = await axios(options).catch((e) =>
    console.log(`ERROR: ${e.message}`)
  );

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// ERROR HANDLING
async function errorHandling() {
  const response = await axios
    .get(urlInvalid)
    .catch((e) => {
      if(e.response) {
        console.log(e.response.data);
        console.log(e.response.status);
        console.log(e.response.headers);
      }
    })

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }

}

// CANCEL TOKEN
async function cancelToken() {
  // we can create a variable to access the cancel token
  const source = axios.CancelToken.source();

  // we can initiate a cancel
  // this ofc. can be put into some if statement to cancel some request based on
  // some condition, etc.
  source.cancel('Request cancelled');

  const response = await axios
    .get(urlPosts, {
      cancelToken: source.token
    })
    .catch((e) => {
      if (axios.isCancel(e)) {
        console.log(e.message);
      }
    });

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// INTERCEPTING REQUESTS & RESPONSES
// we can add interceptors to do smt when the request is made
axios.interceptors.request.use((config) => {
  console.log(
    `${config.method.toUpperCase()} request sent to: ${
      config.url
    } at: ${new Date().getTime()}`
  );

  return config;
});

// AXIOS INSTANCES
// we can add axios instances with predefined parameters
// here we will create an instance which always uses the 'urlDefault' as a
// base url
const axiosInstance1 = axios.create({
  baseURL: urlDefault
});

async function usingInstance() {
  // when 'baseURL' is set we can extend it by adding another string to
  // the .get() call
  const response = await axiosInstance1.get('/todos');

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}

// ADDING TIMEOUT
// we can add a custom timeout
async function timeout() {
  const response = await axios
    .get(urlTodos, {
      params: {
        _limit: 5,
      },
      timeout: 5, // here we set a timeout of 5 milliseconds which will always be triggered
    })
    .catch((e) => console.log(`ERROR: ${e.message}`));

  try {
    showOutput(response);
  } catch (e) {
    console.log(`ERROR:\n${e}`);
  }
}



// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos1);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", useCustomHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
document.getElementById("instance").addEventListener("click", usingInstance);
document.getElementById("timeout").addEventListener("click", timeout);
