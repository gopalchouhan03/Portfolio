export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  status: string;
  statusColor: string;
  cover: string;
  demo: string;
  github: string;
  features: string[];
  overview: string;
  whatUsersCan: string[];
  whyBuilt: string[];
  techStack: string[];
  futureParams: string[];
  relatedProjectIds: number[];
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: 'Udaan',
    description: 'An AI-powered career guidance and emotional support platform designed for students.',
    longDescription:
      'Udaan is a student-focused platform that helps users explore career paths, understand their strengths, and receive guidance using structured data and AI-driven insights. The platform is designed to be simple, supportive, and accessible for students from diverse backgrounds.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'AI'],
    status: 'In Progress',
    statusColor: 'bg-yellow-500/20 text-yellow-400',
    cover: '/images/projects/Udaan.png',
    demo: 'https://udaanxgopal.vercel.app',
    github: 'https://github.com/gopalchouhan03/Udaan-AI.git',
    features: [
      'Career guidance workflow',
      'AI-assisted recommendations',
      'Student-friendly UI',
      'Scalable backend architecture',
      'Future-ready design for AI features'
    ],
    overview: 'Udaan is a student-focused platform that helps users explore career paths, understand their strengths, and receive guidance using structured data and AI-driven insights. The platform is designed to be simple, supportive, and accessible for students from diverse backgrounds.',
    whatUsersCan: [
      'Explore various career options and opportunities',
      'Get personalized career recommendations based on interests',
      'Receive emotional support through guided resources',
      'Access mentorship and guidance from experienced professionals',
      'Track their career progression and learning journey',
      'Participate in community forums and discussions'
    ],
    whyBuilt: [
      'Many students are confused about career choices without proper guidance.',
      'Emotional support resources are scattered and hard to find.',
      'Career guidance platforms are often expensive and inaccessible.',
      'AI can provide personalized recommendations at scale.',
      'Students need a safe, supportive community.',
      'Gap between skills students have and what industry needs.'
    ],
    techStack: [
      'Frontend: React, Tailwind CSS',
      'Backend: Node.js, Express',
      'Database: MongoDB',
      'AI Integration: OpenAI API',
      'Authentication: JWT',
      'Deployment: Docker, AWS'
    ],
    futureParams: [
      'Integrate advanced AI models for better recommendations',
      'Add video mentorship features',
      'Build mobile application',
      'Implement real-time chat support',
      'Create job marketplace integration',
      'Add skill assessment tests'
    ],
    relatedProjectIds: [2, 5]
  },
  {
    id: 2,
    title: 'Smart OPD System',
    description: 'A smart OPD management system for handling appointments, patients, and doctors efficiently.',
    longDescription:
      'Smart OPD is a real-world healthcare management system that streamlines OPD operations. It allows hospitals and clinics to manage patient records, doctor schedules, and appointments digitally, reducing manual effort and improving efficiency.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    status: 'Completed',
    statusColor: 'bg-green-500/20 text-green-400',
    cover: '/images/projects/SmartOPD.png',
    demo: 'https://smart-opdxgopal.vercel.app',
    github: 'https://github.com/gopalchouhan03/Smart-OPD.git',
    features: [
      'Patient & doctor management',
      'Appointment scheduling',
      'Role-based access',
      'Secure data handling',
      'Clean and intuitive UI'
    ],
    overview: 'Smart OPD is a real-world healthcare management system that streamlines OPD operations. It allows hospitals and clinics to manage patient records, doctor schedules, and appointments digitally, reducing manual effort and improving efficiency.',
    whatUsersCan: [
      'Schedule appointments with doctors seamlessly',
      'Manage patient medical records and history',
      'View and update doctor availability and schedules',
      'Generate reports and analytics on OPD operations',
      'Send automated reminders to patients',
      'Access patient information securely with role-based permissions'
    ],
    whyBuilt: [
      'Most hospitals still use manual paper-based systems.',
      'Patient wait times are high due to inefficient scheduling.',
      'Medical records are scattered and hard to access.',
      'No real-time visibility into doctor availability.',
      'Difficult to track patient history and treatment plans.',
      'Need for secure, compliant healthcare data management.'
    ],
    techStack: [
      'Frontend: React, Material-UI',
      'Backend: Node.js, Express',
      'Database: MongoDB',
      'Authentication: JWT with role-based access',
      'Encryption: bcryptjs for password security',
      'Deployment: Heroku, MongoDB Atlas'
    ],
    futureParams: [
      'Add SMS/Email notifications for appointments',
      'Integrate with payment gateways',
      'Build mobile app for doctors and patients',
      'Add telemedicine features',
      'Implement prescription management',
      'Add lab integration for test results'
    ],
    relatedProjectIds: [5, 1]
  },
  {
    id: 3,
    title: 'MyBlog',
    description: 'A personal blogging platform to share technical learnings, tutorials, and thoughts.',
    longDescription:
      'MyBlog is a personal blog platform built to document my learning journey, technical concepts, and experiences. It focuses on clean design, readability, and performance, making content easy to consume and manage.',
    tags: ['Next.js', 'MDX', 'Tailwind CSS'],
    status: 'Published',
    statusColor: 'bg-blue-500/20 text-blue-400',
    cover: '/images/projects/MyBlog.png ',
    demo: 'https://my-blogxgopal.vercel.app',
    github: 'https://github.com/gopalchouhan03/MyBlog.git',
    features: [
      'MDX-based blogs',
      'SEO-friendly pages',
      'Clean typography',
      'Tag-based organization',
      'Fast and lightweight'
    ],
    overview: 'MyBlog is a personal blog platform built to document my learning journey, technical concepts, and experiences. It focuses on clean design, readability, and performance, making content easy to consume and manage.',
    whatUsersCan: [
      'Read in-depth technical articles and tutorials',
      'Filter blogs by category and tags',
      'Search for specific topics',
      'Read estimated time for each article',
      'Subscribe to new articles and updates',
      'Share articles on social media'
    ],
    whyBuilt: [
      'Wanted to document my learning journey.',
      'Existing blogging platforms lack customization.',
      'Need for a fast, SEO-optimized blog.',
      'Share knowledge with the tech community.',
      'Build personal brand and portfolio.',
      'Create a searchable knowledge base.'
    ],
    techStack: [
      'Frontend: React, Tailwind CSS',
      'Backend: Node.js, Express',
      'Database: MongoDB',
      'AI Integration: OpenAI API',
      'Authentication: JWT',
      'Deployment: Vercel'
    ],
    futureParams: [
      'Add comment system with authentication',
      'Implement newsletter subscription',
      'Add reading progress indicator',
      'Create interactive code playground',
      'Add analytics and engagement tracking',
      'Build mobile-optimized reading mode'
    ],
    relatedProjectIds: [4, 1]
  },
  {
    id: 4,
    title: 'Nexus VideoMeet',
    description: 'A real-time video calling application built using WebRTC and Socket.IO.',
    longDescription:
      'Nexus VideoMeet is a real-time video communication application that enables peer-to-peer video calls. It uses WebRTC for media streaming and Socket.IO for signaling, focusing on low latency and smooth connections.',
    tags: ['React', 'WebRTC', 'Socket.IO', 'Node.js'],
    status: 'Operational',
    statusColor: 'bg-green-500/20 text-green-400',
    cover: '/images/projects/Nexus_VideoMeet.png',
    demo: 'https://nexus-videomeet.vercel.app',
    github: 'https://github.com/gopalchouhan03/Nexus_Videomeet.git',
    features: [
      'Peer-to-peer video calling',
      'Real-time signaling',
      'Low-latency communication',
      'Room-based meetings',
      'Modern UI'
    ],
    overview: 'Nexus VideoMeet is a real-time video communication application that enables peer-to-peer video calls. It uses WebRTC for media streaming and Socket.IO for signaling, focusing on low latency and smooth connections.',
    whatUsersCan: [
      'Make one-on-one video calls with low latency',
      'Create and join meeting rooms',
      'Screen sharing capabilities',
      'Real-time chat during calls',
      'Record video calls (coming soon)',
      'Customizable meeting settings'
    ],
    whyBuilt: [
      'Wanted to learn WebRTC and real-time communication.',
      'Existing solutions are expensive or privacy-invasive.',
      'Need for a peer-to-peer alternative to centralized services.',
      'Educational project to understand media streaming.',
      'Building a solution that respects user privacy.',
      'Exploring low-latency communication protocols.'
    ],
    techStack: [
      'Frontend: React, Material-UI',
      'Backend: Node.js, Express',
      'Real-time: Socket.IO',
      'Media: WebRTC API',
      'Signaling: Custom signaling server',
      'Deployment: AWS EC2'
    ],
    futureParams: [
      'Add group video conferencing (SFU)',
      'Implement virtual backgrounds',
      'Add call recording and playback',
      'Create mobile app',
      'Implement end-to-end encryption',
      'Add analytics and call quality metrics'
    ],
    relatedProjectIds: [2, 1]
  },
  {
    id: 5,
    title: 'Scam Alert',
    description: 'A scam awareness and alert platform focused on helping Indian users stay safe online.',
    longDescription:
      'Scam Alert is a public-awareness platform designed to educate users about common scams. It aims to be accessible to both educated and less-educated users by presenting information in a clear and simple manner.',
    tags: ['React', 'Node.js', 'MongoDB'],
    status: 'In Progress',
    statusColor: 'bg-yellow-500/20 text-yellow-400',
    cover: '/images/projects/Scam_alert.png',
    demo: 'https://scam-alertxgopal.vercel.app',
    github: 'https://github.com/gopalchouhan03/Scam-Alert.git',
    features: [
      'Scam reporting awareness',
      'User-friendly content',
      'Category-based scam listing',
      'Simple and accessible UI',
      'Focused on real-world impact'
    ],
    overview: 'Scam Alert is a public-awareness platform designed to educate users about common scams. It aims to be accessible to both educated and less-educated users by presenting information in a clear and simple manner.',
    whatUsersCan: [
      'Learn about common scams with real examples',
      'Understand how scammers work and their tactics',
      'Report scams they have encountered',
      'Get tips on how to protect themselves',
      'Share alerts with family and friends',
      'Access scam resources in regional languages'
    ],
    whyBuilt: [
      'India has a high rate of online scams targeting vulnerable users.',
      'Lack of awareness is the primary reason scams succeed.',
      'Existing resources are often complex and hard to understand.',
      'Need for a platform that educates in simple terms.',
      'Scammers evolve quickly; need real-time alerts.',
      'Personal motivation to protect family and community.'
    ],
    techStack: [
      'Frontend: React, Bootstrap',
      'Backend: Node.js, Express',
      'Database: MongoDB',
      'Real-time Updates: Socket.IO',
      'SMS Alerts: Twilio API',
      'Deployment: Render'
    ],
    futureParams: [
      'Add WhatsApp integration for alerts',
      'Create mobile app for better accessibility',
      'Add voice-based scam reporting',
      'Integrate with police reporting systems',
      'Add AI-powered scam detection',
      'Build community-driven reporting system'
    ],
    relatedProjectIds: [1, 2]
  },
  {
    id: 6,
    title: 'Book Store',
    description: 'An online bookstore platform that allows users to browse, search, and purchase books بسهولة with a smooth user experience.',

    longDescription:
      'Book Store is a full-stack web application designed to provide users with a seamless online book shopping experience. It allows users to explore a wide range of books, view detailed information, and purchase them بسهولة. The platform focuses on clean UI, fast performance, and easy navigation for all types of users.',

    tags: ['React', 'Node.js', 'MongoDB'],

    status: 'In Progress',
    statusColor: 'bg-yellow-500/20 text-yellow-400',

    cover: '/images/projects/book-store.png',
    demo: 'https://book-storexgopal.vercel.app',
    github: 'https://github.com/gopalchouhan03/bookStore.git',

    features: [
      'Browse books by categories and genres',
      'Search functionality with filters',
      'Detailed book pages with descriptions and pricing',
      'Add to cart and checkout system',
      'User authentication and account management',
      'Responsive and user-friendly UI'
    ],

    overview:
      'Book Store is an online platform that enables users to discover, explore, and purchase books with ease. It is designed for smooth navigation, fast performance, and an enjoyable reading-focused experience.',

    whatUsersCan: [
      'Browse books by category, author, or genre',
      'Search books using keywords',
      'View detailed information about each book',
      'Add books to cart and place orders',
      'Create and manage their accounts',
      'Access the platform from mobile and desktop devices'
    ],

    whyBuilt: [
      'To create a real-world e-commerce project for learning full-stack development',
      'To provide users with an easy way to discover and buy books online',
      'To practice building scalable and user-friendly applications',
      'To implement authentication, cart, and payment flow',
      'To improve UI/UX design skills',
      'Personal interest in books and online platforms'
    ],

    techStack: [
      'Frontend: React, Bootstrap',
      'Backend: Node.js, Express',
      'Database: MongoDB',
      'Authentication: JWT',
      'State Management: Context API / Redux',
      'Deployment: Vercel / Render'
    ],

    futureParams: [
      'Add online payment integration (Razorpay/Stripe)',
      'Implement book reviews and ratings system',
      'Add wishlist feature',
      'Introduce admin dashboard for managing books',
      'AI-based book recommendation system',
      'Add order tracking functionality'
    ],

    relatedProjectIds: [1, 2]
  }
];
