import { Question } from '../types';

export const questionDatabase: Record<string, Question[]> = {
  'React': [
    {
      id: 'react-easy-1',
      text: 'What is JSX in React?',
      difficulty: 'easy',
      options: [
        'A JavaScript function that generates dynamic content.',
        'A syntax extension for JavaScript that allows writing HTML-like code in React components.',
        'A new version of HTML that runs on the browser.',
        'A style sheet language for styling React components.'
      ],
      correctAnswer: 'A syntax extension for JavaScript that allows writing HTML-like code in React components.',
      topic: 'React'
    },
    {
      id: 'react-easy-2',
      text: 'What is the main difference between state and props?',
      difficulty: 'easy',
      options: [
        'State is for UI, props are for data.',
        'State is mutable and managed within a component, while props are immutable and passed from a parent.',
        'State is a keyword, while props is an object.',
        'Props are used for styling, while state is used for logic.'
      ],
      correctAnswer: 'State is mutable and managed within a component, while props are immutable and passed from a parent.',
      topic: 'React'
    },
    {
      id: 'react-medium-1',
      text: 'When would you use a cleanup function in the useEffect hook?',
      difficulty: 'medium',
      options: [
        'To perform a side effect after every render.',
        'To update the component\'s state asynchronously.',
        'To clean up resources like timers or event listeners before the component unmounts.',
        'To prevent the component from re-rendering.'
      ],
      correctAnswer: 'To clean up resources like timers or event listeners before the component unmounts.',
      topic: 'React'
    },
    {
      id: 'react-medium-2',
      text: 'How does React\'s Virtual DOM optimize performance?',
      difficulty: 'medium',
      options: [
        'It directly manipulates the real DOM, making changes instantly.',
        'It is a copy of the real DOM that is never updated.',
        'It compares the new and old Virtual DOM, then updates only the changed parts of the real DOM.',
        'It completely replaces the real DOM on every state change.'
      ],
      correctAnswer: 'It compares the new and old Virtual DOM, then updates only the changed parts of the real DOM.',
      topic: 'React'
    },
    {
      id: 'react-hard-1',
      text: 'What is a key benefit of React Fiber architecture?',
      difficulty: 'hard',
      options: [
        'It forces all component updates to be synchronous.',
        'It enables incremental rendering by breaking work into units that can be prioritized and resumed.',
        'It completely eliminates the need for the Virtual DOM.',
        'It removes the need for component state.'
      ],
      correctAnswer: 'It enables incremental rendering by breaking work into units that can be prioritized and resumed.',
      topic: 'React'
    },
    {
      id: 'react-hard-2',
      text: 'What is the primary purpose of a custom hook for debouncing user input?',
      difficulty: 'hard',
      options: [
        'To increase the number of state updates.',
        'To trigger an effect immediately after every keystroke.',
        'To ensure a function is only called after a specified delay since the last input.',
        'To make the component re-render more frequently.'
      ],
      correctAnswer: 'To ensure a function is only called after a specified delay since the last input.',
      topic: 'React'
    }
  ],
  'JavaScript': [
    {
      id: 'js-easy-1',
      text: 'Which keyword is block-scoped but can be reassigned?',
      difficulty: 'easy',
      options: ['var', 'const', 'let', 'function'],
      correctAnswer: 'let',
      topic: 'JavaScript'
    },
    {
      id: 'js-easy-2',
      text: 'What is a key difference between arrow functions and regular functions?',
      difficulty: 'easy',
      options: [
        'Arrow functions have a `prototype` property.',
        'Regular functions lexically bind the `this` value.',
        'Arrow functions do not have their own `this` context.',
        'Regular functions are always anonymous.'
      ],
      correctAnswer: 'Arrow functions do not have their own `this` context.',
      topic: 'JavaScript'
    },
    {
      id: 'js-medium-1',
      text: 'What is the correct way to stop event propagation in JavaScript?',
      difficulty: 'medium',
      options: [
        'event.preventDefault()',
        'event.stopPropagation()',
        'event.cancelBubble()',
        'event.stopBubbling()'
      ],
      correctAnswer: 'event.stopPropagation()',
      topic: 'JavaScript'
    },
    {
      id: 'js-medium-2',
      text: 'What is a closure in JavaScript?',
      difficulty: 'medium',
      options: [
        'A function that returns a new object.',
        'A function that can access variables from its outer scope even after the outer function has finished executing.',
        'A function that is only called once.',
        'A special type of class in JavaScript.'
      ],
      correctAnswer: 'A function that can access variables from its outer scope even after the outer function has finished executing.',
      topic: 'JavaScript'
    },
    {
      id: 'js-hard-1',
      text: 'What is the purpose of the JavaScript Event Loop?',
      difficulty: 'hard',
      options: [
        'To execute all code synchronously in a loop.',
        'To move tasks from the task queue to the call stack when the stack is empty.',
        'To manage the order of function calls in the call stack.',
        'To ensure all asynchronous operations are blocked until they are complete.'
      ],
      correctAnswer: 'To move tasks from the task queue to the call stack when the stack is empty.',
      topic: 'JavaScript'
    },
    {
      id: 'js-hard-2',
      text: 'Which tool would you use to prevent infinite recursion in a deep clone function?',
      difficulty: 'hard',
      options: [
        'An array to track visited properties.',
        'A WeakMap to track visited objects for circular references.',
        'A global variable to count recursion depth.',
        'A `for` loop instead of recursion.'
      ],
      correctAnswer: 'A WeakMap to track visited objects for circular references.',
      topic: 'JavaScript'
    }
  ],
  'Frontend': [
    {
      id: 'fe-easy-1',
      text: 'What is the CSS box model?',
      difficulty: 'easy',
      options: [
        'The CSS box model consists of content, padding, border, and margin.',
        'The CSS box model is used for JavaScript functions.',
        'The CSS box model is a database schema.',
        'The CSS box model is used for event handling.'
      ],
      correctAnswer: 'The CSS box model consists of content, padding, border, and margin.',
      topic: 'Frontend'
    },
    {
      id: 'fe-easy-2',
      text: 'What is the difference between display: none and visibility: hidden?',
      difficulty: 'easy',
      options: [
        'display: none removes the element from the document flow and does not take up space. visibility: hidden hides the element but it still occupies space in the layout.',
        'display: none and visibility: hidden are the same.',
        'display: none makes the element visible.',
        'visibility: hidden removes the element from the DOM.'
      ],
      correctAnswer: 'display: none removes the element from the document flow and does not take up space. visibility: hidden hides the element but it still occupies space in the layout.',
      topic: 'Frontend'
    },
    {
      id: 'fe-medium-1',
      text: 'Explain CSS Flexbox and Grid. When would you use one over the other?',
      difficulty: 'medium',
      options: [
        'Flexbox is one-dimensional (row or column) and best for component layouts. Grid is two-dimensional (rows and columns) and best for page layouts.',
        'Flexbox is only for two-dimensional layouts.',
        'Grid is only for navigation bars.',
        'Flexbox and Grid are used for database queries.'
      ],
      correctAnswer: 'Flexbox is one-dimensional (row or column) and best for component layouts. Grid is two-dimensional (rows and columns) and best for page layouts.',
      topic: 'Frontend'
    },
    {
      id: 'fe-medium-2',
      text: 'What are CSS specificity rules? How is specificity calculated?',
      difficulty: 'medium',
      options: [
        'Specificity determines which CSS rule applies when multiple rules target the same element. Calculated as (inline, IDs, classes/attributes, elements).',
        'Specificity is only for JavaScript functions.',
        'Specificity is used for database indexing.',
        'Specificity is not important in CSS.'
      ],
      correctAnswer: 'Specificity determines which CSS rule applies when multiple rules target the same element. Calculated as (inline, IDs, classes/attributes, elements).',
      topic: 'Frontend'
    },
    {
      id: 'fe-hard-1',
      text: 'Explain Critical Rendering Path optimization. What techniques would you use to improve First Contentful Paint?',
      difficulty: 'hard',
      options: [
        'Optimize CRP by minimizing critical resources, reducing bytes, and shortening critical path length. Techniques: inline critical CSS, defer non-critical CSS/JS, use resource hints (preload, prefetch), optimize images, use CDN, implement code splitting.',
        'Critical Rendering Path is only for backend.',
        'First Contentful Paint is not affected by CSS.',
        'Use more JavaScript to improve FCP.'
      ],
      correctAnswer: 'Optimize CRP by minimizing critical resources, reducing bytes, and shortening critical path length. Techniques: inline critical CSS, defer non-critical CSS/JS, use resource hints (preload, prefetch), optimize images, use CDN, implement code splitting.',
      topic: 'Frontend'
    },
    {
      id: 'fe-hard-2',
      text: 'How would you implement a performant infinite scroll with virtual scrolling? What challenges might you face?',
      difficulty: 'hard',
      options: [
        'Render only visible items plus buffer, calculate positions based on scroll offset, use absolute positioning, track scroll events with throttling/IntersectionObserver.',
        'Render all items at once for performance.',
        'Infinite scroll is not possible in frontend.',
        'Use only CSS for infinite scroll.'
      ],
      correctAnswer: 'Render only visible items plus buffer, calculate positions based on scroll offset, use absolute positioning, track scroll events with throttling/IntersectionObserver.',
      topic: 'Frontend'
    }
  ],
  'Backend': [
    {
      id: 'be-easy-1',
      text: 'What is the difference between GET and POST HTTP methods?',
      difficulty: 'easy',
      options: [
        'GET retrieves data and is idempotent. POST submits data to create/update resources and is not idempotent.',
        'GET is less secure than POST.',
        'POST retrieves data and GET submits data.',
        'GET and POST are used for the same purpose.'
      ],
      correctAnswer: 'GET retrieves data and is idempotent. POST submits data to create/update resources and is not idempotent.',
      topic: 'Backend'
    },
    {
      id: 'be-easy-2',
      text: 'What is a key principle of a RESTful API?',
      difficulty: 'easy',
      options: [
        'It must be stateless.',
        'It must use a single endpoint.',
        'It is primarily used for graphical user interfaces.',
        'It requires a custom protocol.'
      ],
      correctAnswer: 'It must be stateless.',
      topic: 'Backend'
    },
    {
      id: 'be-medium-1',
      text: 'When would you choose a NoSQL database over a SQL database?',
      difficulty: 'medium',
      options: [
        'When the data structure is highly rigid and requires complex joins.',
        'When you need to handle a large volume of unstructured data with flexible schemas.',
        'When strong ACID compliance is the highest priority.',
        'When the application is very small.'
      ],
      correctAnswer: 'When you need to handle a large volume of unstructured data with flexible schemas.',
      topic: 'Backend'
    },
    {
      id: 'be-medium-2',
      text: 'What is the purpose of middleware in backend development?',
      difficulty: 'medium',
      options: [
        'To handle the frontend UI.',
        'To process or transform requests and responses.',
        'To manage the server\'s operating system.',
        'To create database schemas.'
      ],
      correctAnswer: 'To process or transform requests and responses.',
      topic: 'Backend'
    },
    {
      id: 'be-hard-1',
      text: 'Which rate limit strategy is best suited for a distributed environment and provides a more granular approach than a fixed window?',
      difficulty: 'hard',
      options: [
        'Fixed window counter.',
        'Sliding window counter.',
        'Leaky bucket.',
        'Token bucket.'
      ],
      correctAnswer: 'Sliding window counter.',
      topic: 'Backend'
    },
    {
      id: 'be-hard-2',
      text: 'What is a key technique to optimize a slow query involving multiple joins in a relational database?',
      difficulty: 'hard',
      options: [
        'Increasing the number of database tables.',
        'Removing all indexes.',
        'Creating indexes on the columns used for `JOIN` and `WHERE` clauses.',
        'Converting the database to NoSQL.'
      ],
      correctAnswer: 'Creating indexes on the columns used for `JOIN` and `WHERE` clauses.',
      topic: 'Backend'
    }
  ],
  'Node.js': [
    {
      id: 'node-easy-1',
      text: 'What makes Node.js non-blocking?',
      difficulty: 'easy',
      options: [
        'It uses a multi-threaded architecture.',
        'It employs an event-driven, asynchronous I/O model.',
        'It is a synchronous runtime.',
        'It blocks all operations until they are complete.'
      ],
      correctAnswer: 'It employs an event-driven, asynchronous I/O model.',
      topic: 'Node.js'
    },
    {
      id: 'node-easy-2',
      text: 'What is the main purpose of the `package.json` file?',
      difficulty: 'easy',
      options: [
        'To store user data.',
        'To define project metadata, dependencies, and scripts.',
        'To serve as the main entry point for the application.',
        'To manage environmental variables.'
      ],
      correctAnswer: 'To define project metadata, dependencies, and scripts.',
      topic: 'Node.js'
    },
    {
      id: 'node-medium-1',
      text: 'How would you implement a custom event emitter in Node.js?',
      difficulty: 'medium',
      options: [
        'By using the `fs` module.',
        'By extending the built-in `EventEmitter` class.',
        'By using a `while` loop.',
        'By creating a new instance of a class.'
      ],
      correctAnswer: 'By extending the built-in `EventEmitter` class.',
      topic: 'Node.js'
    },
    {
      id: 'node-medium-2',
      text: 'Which function executes its callback before the next event loop iteration?',
      difficulty: 'medium',
      options: ['`setTimeout()`', '`setImmediate()`', '`process.nextTick()`', '`requestAnimationFrame()`'],
      correctAnswer: '`process.nextTick()`',
      topic: 'Node.js'
    },
    {
      id: 'node-hard-1',
      text: 'What is the primary benefit of using the `cluster` module in Node.js?',
      difficulty: 'hard',
      options: [
        'To handle synchronous operations faster.',
        'To utilize multiple CPU cores by creating worker processes.',
        'To manage a single-process application.',
        'To handle I/O-bound tasks more efficiently.'
      ],
      correctAnswer: 'To utilize multiple CPU cores by creating worker processes.',
      topic: 'Node.js'
    },
    {
      id: 'node-hard-2',
      text: 'Which tool is most effective for diagnosing memory leaks in a Node.js application?',
      difficulty: 'hard',
      options: [
        'Using a simple `console.log()`',
        'Heap snapshots from Chrome DevTools.',
        'Checking the CPU usage.',
        'Restarting the application daily.'
      ],
      correctAnswer: 'Heap snapshots from Chrome DevTools.',
      topic: 'Node.js'
    }
  ],
  'Python': [
    {
      id: 'py-easy-1',
      text: 'What is the key difference between a list and a tuple in Python?',
      difficulty: 'easy',
      options: [
        'Lists are immutable, and tuples are mutable.',
        'Lists are mutable, and tuples are immutable.',
        'Lists use parentheses, and tuples use square brackets.',
        'There is no difference between them.'
      ],
      correctAnswer: 'Lists are mutable, and tuples are immutable.',
      topic: 'Python'
    },
    {
      id: 'py-easy-2',
      text: 'What is a list comprehension?',
      difficulty: 'easy',
      options: [
        'A concise way to create lists.',
        'A way to define a new function.',
        'A type of loop for lists.',
        'A method for sorting lists.'
      ],
      correctAnswer: 'A concise way to create lists.',
      topic: 'Python'
    },
    {
      id: 'py-medium-1',
      text: 'What is the purpose of a decorator in Python?',
      difficulty: 'medium',
      options: [
        'To change the name of a function.',
        'To modify the behavior of another function.',
        'To define a new class.',
        'To handle exceptions.'
      ],
      correctAnswer: 'To modify the behavior of another function.',
      topic: 'Python'
    },
    {
      id: 'py-medium-2',
      text: 'What is the key difference between a deep copy and a shallow copy?',
      difficulty: 'medium',
      options: [
        'A shallow copy is always slower.',
        'A deep copy copies all nested objects, creating a completely independent new object.',
        'A deep copy only works for simple data types.',
        'A shallow copy is not possible in Python.'
      ],
      correctAnswer: 'A deep copy copies all nested objects, creating a completely independent new object.',
      topic: 'Python'
    },
    {
      id: 'py-hard-1',
      text: 'What is Python\'s GIL (Global Interpreter Lock)?',
      difficulty: 'hard',
      options: [
        'A lock that allows multiple threads to execute Python bytecode simultaneously.',
        'A mechanism that improves the performance of I/O-bound tasks.',
        'A mutex that prevents multiple threads from executing Python bytecode simultaneously.',
        'A lock that is only used for database connections.'
      ],
      correctAnswer: 'A mutex that prevents multiple threads from executing Python bytecode simultaneously.',
      topic: 'Python'
    },
    {
      id: 'py-hard-2',
      text: 'When would you use a metaclass?',
      difficulty: 'hard',
      options: [
        'To define an instance of a class.',
        'To define a simple function.',
        'When you need to dynamically modify or create classes before they are instantiated.',
        'To create a new module.'
      ],
      correctAnswer: 'When you need to dynamically modify or create classes before they are instantiated.',
      topic: 'Python'
    }
  ],
  'Database': [
    {
      id: 'db-easy-1',
      text: 'What is a primary key in a database?',
      difficulty: 'easy',
      options: [
        'A unique identifier for each record in a table.',
        'A key used for connecting to a database.',
        'A key that can have duplicate values.',
        'A key that can contain NULL values.'
      ],
      correctAnswer: 'A unique identifier for each record in a table.',
      topic: 'Database'
    },
    {
      id: 'db-easy-2',
      text: 'What is the difference between INNER JOIN and LEFT JOIN?',
      difficulty: 'easy',
      options: [
        'INNER JOIN returns all records from both tables. LEFT JOIN returns only matching records.',
        'INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from the left table and matching records from the right table.',
        'INNER JOIN and LEFT JOIN are the same.',
        'LEFT JOIN is used for adding new data.'
      ],
      correctAnswer: 'INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from the left table and matching records from the right table.',
      topic: 'Database'
    },
    {
      id: 'db-medium-1',
      text: 'What is database normalization?',
      difficulty: 'medium',
      options: [
        'The process of organizing data to reduce redundancy.',
        'The process of adding more data to a table.',
        'The process of making a database slower.',
        'The process of securing a database.'
      ],
      correctAnswer: 'The process of organizing data to reduce redundancy.',
      topic: 'Database'
    },
    {
      id: 'db-medium-2',
      text: 'What is the primary trade-off of using a database index?',
      difficulty: 'medium',
      options: [
        'Slower reads for faster writes.',
        'Faster reads for slower writes and increased storage space.',
        'Improved data integrity at the cost of consistency.',
        'Less storage space.'
      ],
      correctAnswer: 'Faster reads for slower writes and increased storage space.',
      topic: 'Database'
    },
    {
      id: 'db-hard-1',
      text: 'What does the "C" in ACID properties stand for?',
      difficulty: 'hard',
      options: ['Connection', 'Concurrency', 'Consistency', 'Completeness'],
      correctAnswer: 'Consistency',
      topic: 'Database'
    },
    {
      id: 'db-hard-2',
      text: 'Why might you use denormalization in a database schema for a social media platform?',
      difficulty: 'hard',
      options: [
        'To strictly enforce data integrity.',
        'To increase query complexity.',
        'To optimize for faster read operations at the cost of some data redundancy.',
        'To reduce the total number of tables.'
      ],
      correctAnswer: 'To optimize for faster read operations at the cost of some data redundancy.',
      topic: 'Database'
    }
  ],
  'System Design': [
    {
      id: 'sd-easy-1',
      text: 'What is the difference between horizontal and vertical scaling?',
      difficulty: 'easy',
      options: [
        'Vertical scaling adds more servers, horizontal scaling adds more resources to a single server.',
        'Horizontal scaling adds more servers, vertical scaling adds more resources to a single server.',
        'They are the same concept.',
        'Vertical scaling is only for databases.'
      ],
      correctAnswer: 'Horizontal scaling adds more servers, vertical scaling adds more resources to a single server.',
      topic: 'System Design'
    },
    {
      id: 'sd-easy-2',
      text: 'What is the main purpose of a load balancer?',
      difficulty: 'easy',
      options: [
        'To increase server costs.',
        'To distribute incoming traffic across multiple servers.',
        'To cache static content only.',
        'To manage a single server.'
      ],
      correctAnswer: 'To distribute incoming traffic across multiple servers.',
      topic: 'System Design'
    },
    {
      id: 'sd-medium-1',
      text: 'Which caching strategy involves writing data to both the cache and the database simultaneously?',
      difficulty: 'medium',
      options: ['Cache-aside', 'Write-through', 'Write-back', 'Write-around'],
      correctAnswer: 'Write-through',
      topic: 'System Design'
    },
    {
      id: 'sd-medium-2',
      text: 'According to CAP theorem, which two properties can a distributed system guarantee at most?',
      difficulty: 'medium',
      options: [
        'Consistency and Availability',
        'Consistency and Partition tolerance',
        'Availability and Partition tolerance',
        'Latency and Consistency'
      ],
      correctAnswer: 'Consistency and Partition tolerance',
      topic: 'System Design'
    },
    {
      id: 'sd-hard-1',
      text: 'When designing a URL shortening service, what is a crucial challenge to handle?',
      difficulty: 'hard',
      options: [
        'Storing all URLs in a single file.',
        'Encrypting all URLs.',
        'Generating a unique hash for each URL and handling collisions.',
        'Ensuring all shortened URLs are less than 10 characters.'
      ],
      correctAnswer: 'Generating a unique hash for each URL and handling collisions.',
      topic: 'System Design'
    },
    {
      id: 'sd-hard-2',
      text: 'Which technology is commonly used for real-time notifications in a scalable system?',
      difficulty: 'hard',
      options: ['FTP', 'WebSockets', 'SMTP', 'SFTP'],
      correctAnswer: 'WebSockets',
      topic: 'System Design'
    }
  ],
  'DevOps': [
    {
      id: 'do-easy-1',
      text: 'What is the main benefit of a CI/CD pipeline?',
      difficulty: 'easy',
      options: [
        'It automates the process of building, testing, and deploying code.',
        'It requires more manual intervention.',
        'It is only used for bug fixing.',
        'It ensures code can only be deployed to a single server.'
      ],
      correctAnswer: 'It automates the process of building, testing, and deploying code.',
      topic: 'DevOps'
    },
    {
      id: 'do-easy-2',
      text: 'How does a Docker container differ from a Virtual Machine?',
      difficulty: 'easy',
      options: [
        'Docker containers virtualize the hardware, while VMs do not.',
        'VMs are typically more lightweight than containers.',
        'Containers share the host OS kernel, while VMs have their own OS.',
        'VMs are used for development only.'
      ],
      correctAnswer: 'Containers share the host OS kernel, while VMs have their own OS.',
      topic: 'DevOps'
    },
    {
      id: 'do-medium-1',
      text: 'What is the difference between a Docker image and a Docker container?',
      difficulty: 'medium',
      options: [
        'An image is a running instance of a container.',
        'An image is a read-only template from which a container is created.',
        'They are interchangeable terms.',
        'A container is a read-only template.'
      ],
      correctAnswer: 'An image is a read-only template from which a container is created.',
      topic: 'DevOps'
    },
    {
      id: 'do-medium-2',
      text: 'What is Infrastructure as Code (IaC)?',
      difficulty: 'medium',
      options: [
        'Manually configuring servers.',
        'Managing infrastructure through code files.',
        'Writing security protocols for applications.',
        'Managing user permissions.'
      ],
      correctAnswer: 'Managing infrastructure through code files.',
      topic: 'DevOps'
    },
    {
      id: 'do-hard-1',
      text: 'Which deployment strategy is best for achieving zero-downtime updates?',
      difficulty: 'hard',
      options: ['Manual update', 'Rolling update', 'In-place update', 'Local update'],
      correctAnswer: 'Rolling update',
      topic: 'DevOps'
    },
    {
      id: 'do-hard-2',
      text: 'What problem does a service mesh primarily solve in a microservices architecture?',
      difficulty: 'hard',
      options: [
        'Creating a monolithic application.',
        'Handling service-to-service communication with features like load balancing and security.',
        'Replacing the need for a database.',
        'Reducing the number of services.'
      ],
      correctAnswer: 'Handling service-to-service communication with features like load balancing and security.',
      topic: 'DevOps'
    }
  ],
  'Testing': [
    {
      id: 'test-easy-1',
      text: 'What is the main goal of unit testing?',
      difficulty: 'easy',
      options: [
        'To test how multiple components work together.',
        'To test individual functions or components in isolation.',
        'To test the user interface.',
        'To test the entire application end-to-end.'
      ],
      correctAnswer: 'To test individual functions or components in isolation.',
      topic: 'Testing'
    },
    {
      id: 'test-easy-2',
      text: 'What is the core principle of Test-Driven Development (TDD)?',
      difficulty: 'easy',
      options: [
        'Writing tests after the code is complete.',
        'Writing tests that fail, then writing code to make them pass.',
        'Writing only end-to-end tests.',
        'Avoiding writing tests altogether.'
      ],
      correctAnswer: 'Writing tests that fail, then writing code to make them pass.',
      topic: 'Testing'
    },
    {
      id: 'test-medium-1',
      text: 'According to the testing pyramid, which type of test should be the most numerous?',
      difficulty: 'medium',
      options: ['E2E tests', 'Integration tests', 'Manual tests', 'Unit tests'],
      correctAnswer: 'Unit tests',
      topic: 'Testing'
    },
    {
      id: 'test-medium-2',
      text: 'What is the purpose of a Mock in testing?',
      difficulty: 'medium',
      options: [
        'To provide a fake implementation that returns a predetermined response.',
        'To verify that a specific behavior occurred, such as a function being called with certain arguments.',
        'To record information about a function call without altering it.',
        'To serve as a placeholder for a variable.'
      ],
      correctAnswer: 'To verify that a specific behavior occurred, such as a function being called with certain arguments.',
      topic: 'Testing'
    },
    {
      id: 'test-hard-1',
      text: 'When testing a complex async workflow with multiple API calls, what is a key strategy for reliable tests?',
      difficulty: 'hard',
      options: [
        'Using real, live APIs to test.',
        'Mocking all API responses to control the test environment and data.',
        'Setting a single, long timeout for all asynchronous operations.',
        'Avoiding all asynchronous operations in the tests.'
      ],
      correctAnswer: 'Mocking all API responses to control the test environment and data.',
      topic: 'Testing'
    },
    {
      id: 'test-hard-2',
      text: 'Which testing technique is most effective for ensuring the correctness of a conflict resolution algorithm in a real-time collaborative application?',
      difficulty: 'hard',
      options: [
        'Snapshot testing.',
        'Load testing with millions of users.',
        'Property-based testing with a wide range of inputs and states.',
        'Manual user acceptance testing.'
      ],
      correctAnswer: 'Property-based testing with a wide range of inputs and states.',
      topic: 'Testing'
    }
  ]
};

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateQuestions(topic: string): Question[] {
  const topicQuestions = questionDatabase[topic];
  if (!topicQuestions) {
    throw new Error(`No questions available for topic: ${topic}`);
  }

  // Filter questions by difficulty
  const easyQuestions = topicQuestions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = topicQuestions.filter(q => q.difficulty === 'medium');
  const hardQuestions = topicQuestions.filter(q => q.difficulty === 'hard');

  // Shuffle and select a subset of questions for each difficulty level
  const selectedEasy = shuffleArray(easyQuestions).slice(0, 2);
  const selectedMedium = shuffleArray(mediumQuestions).slice(0, 2);
  const selectedHard = shuffleArray(hardQuestions).slice(0, 2);
  
  // Combine all selected questions and shuffle them again to mix the difficulties
  const allSelectedQuestions = shuffleArray([...selectedEasy, ...selectedMedium, ...selectedHard]);
  
  return allSelectedQuestions;
}

export const availableTopics = Object.keys(questionDatabase);