import { PresetCandidate } from '../types';

export const CANDIDATE_PRESETS: PresetCandidate[] = [
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    title: 'Staff Backend & Cloud Architect',
    verdictHint: 'Strong Yes',
    description: 'High-performing distributed systems engineer with matched CV & LinkedIn history and top-tier open-source GitHub architecture.',
    jobDescription: `Job Title: Staff Backend Engineer - Core Infrastructure
Location: San Francisco, CA (Hybrid: 2 days in office)
Team: Cloud Platform & Event Streaming Team
Experience Required: 6+ years in high-throughput backend services

Role Overview:
We are looking for a Staff Backend Engineer to design and scale our real-time event streaming pipeline processing over 250,000 events/second. You will lead our migration from legacy monolithic workers to a distributed NestJS and Go microservices mesh deployed on Kubernetes (EKS).

Requirements:
- Minimum 6 years of experience building distributed backend systems in TypeScript (NestJS/Node.js) or Go.
- Production experience with Apache Kafka, Redis 7.x Cluster, and PostgreSQL with PgBouncer.
- Strong knowledge of Kubernetes orchestration, Helm charts, and custom Prometheus metrics.
- Prior experience leading cross-functional architectural reviews and mentoring 5+ engineers.
- Must be located within commuting distance of San Francisco, CA.`,
    cvText: `ALEX RIVERA
Email: alex.rivera.dev@example.com | GitHub: github.com/alexrivera-cloud | Location: San Francisco, CA

PROFESSIONAL SUMMARY:
Staff Backend Engineer with 8+ years architecting fault-tolerant distributed platforms, real-time message streams, and microservice meshes. Led infrastructure scale at ScaleWave from 50k to 300k rps.

EMPLOYMENT HISTORY:
ScaleWave Systems — Staff Backend Architect (2020 – Present)
- Designed and maintained core distributed event router processing 300k events/sec using NestJS, Go, and Kafka.
- Reduced p99 API latency by 42% through Redis cluster caching strategies and PostgreSQL partition tuning.
- Mentored a team of 7 senior engineers and drove infrastructure as code adoption via Terraform & EKS.

DataFlow Inc. — Senior Backend Engineer (2017 – 2020)
- Built high-concurrency ingestion pipelines using Node.js, TypeScript, and RabbitMQ.
- Re-architected monolithic billing engine into resilient event-driven microservices.

CloudGrid Solutions — Software Engineer (2015 – 2017)
- Developed REST and gRPC microservices using Go and PostgreSQL.

EDUCATION:
- B.S. in Computer Science, University of California, Berkeley (2011 – 2015)

CORE SKILLS:
NestJS, TypeScript, Go, Apache Kafka, Redis 7, PostgreSQL, Kubernetes, Docker, AWS (EKS, RDS, S3), Prometheus, Distributed Systems.`,
    linkedinText: `Alex Rivera
Staff Backend Architect at ScaleWave Systems | Distributed Systems & High-Throughput Cloud
San Francisco Bay Area

Experience:
ScaleWave Systems
Staff Backend Architect
2020 – Present · 4 yrs
San Francisco, California
Leading architecture for real-time stream processing, Kafka pipelines, and NestJS microservices.

DataFlow Inc.
Senior Backend Engineer
2017 – 2020 · 3 yrs
San Francisco, California
High concurrency data pipelines and API architecture.

CloudGrid Solutions
Software Engineer
2015 – 2017 · 2 yrs
Oakland, California

Education:
UC Berkeley
Bachelor of Science - BS, Computer Science
2011 – 2015

Skills:
Distributed Systems, Apache Kafka, NestJS, Go, Kubernetes, Redis, PostgreSQL, AWS, Microservices Architecture`,
    githubText: `GitHub Profile: alexrivera-cloud
Public Repositories: 34 | Followers: 840 | Total Commits (Past Year): 1,420

Top Repositories:
1. repo: distributed-task-orchestrator (TypeScript / NestJS / Redis)
   - Stars: 612 | Forks: 89
   - Description: A distributed task queue and workflow engine with leader election, priority scheduling, and circuit breaker patterns. Built on top of NestJS and Redis Streams.
   - Key Files: /src/engine/leader-election.ts, /src/cluster/circuit-breaker.ts, /src/queue/redis-stream-consumer.ts
   - Recent Commits: "feat(consumer): implement adaptive backoff and DLQ replay worker", "perf(streams): batch XREADGROUP ack pipeline to minimize roundtrips"

2. repo: fast-event-bus-ts (TypeScript)
   - Stars: 245
   - Description: Zero-dependency zero-copy publish-subscribe event emitter with lock-free ring buffer for Node.js workers.

3. repo: kube-autoscaler-controller (Go)
   - Stars: 180
   - Description: Custom Kubernetes CRD controller scaling pods based on Kafka consumer lag metrics.

Languages breakdown:
- TypeScript: 64%
- Go: 26%
- Shell / Dockerfile: 10%`
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    title: 'Senior Frontend Engineer (Embellished Profile)',
    verdictHint: 'Red Flag',
    description: 'Candidate exhibits severe employment date inflation, job title exaggeration between CV and LinkedIn, and generic forked GitHub projects.',
    jobDescription: `Job Title: Lead Frontend Architect - Design Systems & Web Apps
Location: New York, NY (Hybrid: 3 days on-site)
Experience Required: 7+ years in modern web development, Next.js, and TypeScript

Requirements:
- Minimum 7 years developing complex single-page and server-rendered web applications using React & Next.js.
- Demonstrated experience architecting custom Design Systems and Micro-Frontends for enterprise applications.
- Proven track record leading front-end engineering teams of 8+ developers.
- Must have solid experience with React 18/19, Next.js App Router, Tailwind/Vanilla CSS, Webpack/Turbopack, and Web Vitals optimization.
- Bachelor's degree in Computer Science or equivalent.`,
    cvText: `JORDAN LEE
Email: jordan.lee.engineering@example.com | Location: New York, NY

PROFESSIONAL EXPERIENCE:
HyperGrowth Enterprise — Lead Frontend Architect (2019 – Present)
- Directed a department of 22 frontend engineers building next-generation Next.js and React enterprise portals.
- Architected enterprise design system used by 50+ development squads across the globe.
- Implemented micro-frontend architecture using Webpack Module Federation, decreasing build times by 65%.

OmniTech Solutions — Senior Fullstack Developer (2017 – 2019)
- Led UI architecture and migration from AngularJS to React 16.
- Managed end-to-end cloud deployments on AWS and GCP.

EDUCATION:
- M.S. in Computer Science, Columbia University (2015 – 2017)
- B.S. in Computer Science, NYU (2011 – 2015)

SKILLS:
Next.js, React, TypeScript, Micro-Frontends, Design Systems, Architecture, GraphQL, Docker, Kubernetes.`,
    linkedinText: `Jordan Lee
Frontend Developer at HyperGrowth Enterprise | React & UI Developer
Greater New York City Area

Experience:
HyperGrowth Enterprise
Frontend Developer
Jan 2022 – Present · 2 yrs
New York, United States
Building React dashboard components and styling design system buttons.

OmniTech Solutions
Junior Web Developer
Jun 2020 – Dec 2021 · 1 yr 7 mos
New York, United States
Bug fixing in legacy frontend and maintaining HTML/CSS templates.

Education:
City College of New York (CCNY)
Bachelor's degree, Information Technology
2016 – 2020

Skills:
JavaScript, React.js, HTML5, CSS3, Git`,
    githubText: `GitHub Profile: jordanlee-dev
Public Repositories: 8 | Followers: 3 | Total Commits (Past Year): 14

Repositories:
1. repo: nextjs-enterprise-boilerplate (Forked from vercel/next-learn-starter)
   - Stars: 0 | Forks: 0
   - Description: Tutorial starter code for Next.js.
   - Recent Commits: "Update README.md", "initial commit"

2. repo: react-todo-app (JavaScript)
   - Stars: 1
   - Description: Simple React Todo application with LocalStorage.
   - Recent Commits: "fixed typo in button"

3. repo: css-buttons-kit (CSS)
   - Description: Collection of hover effects.

Languages breakdown:
- HTML/CSS: 58%
- JavaScript: 38%
- TypeScript: 4%`
  },
  {
    id: 'taylor-smith',
    name: 'Taylor Smith',
    title: 'Senior AI/ML Engineer applying for Web Platform',
    verdictHint: 'Maybe',
    description: 'Strong technical engineering background with verified timeline, but GitHub and CV are concentrated in Python/ML rather than the core full-stack web stack required by JD.',
    jobDescription: `Job Title: Senior Full-Stack Engineer (Next.js & NestJS)
Location: Remote (US/Canada Timezones)
Experience Required: 4+ years fullstack web development

Requirements:
- 4+ years building full-stack web applications with Next.js (React) and NestJS (Node.js/TypeScript).
- Deep experience with PostgreSQL, Prisma/TypeORM, GraphQL, and Redis.
- Experience delivering user-facing interfaces with high performance and accessibility.
- Ability to work asynchronously in US Eastern to Pacific timezones.`,
    cvText: `TAYLOR SMITH
Email: taylor.smith.ai@example.com | Location: Seattle, WA (Remote)

EXPERIENCE:
NeuroTech Systems — Senior Machine Learning Engineer (2021 – Present)
- Developed high-performance model serving microservices in Python (FastAPI) and C++ ONNX runtime.
- Built internal annotation dashboards with React and TypeScript.
- Scaled inference endpoints to handle 15 million daily predictions.

VisionLabs Inc. — Software Engineer (2019 – 2021)
- Built backend ETL data pipelines using Python, PostgreSQL, and Docker.
- Collaborated with frontend engineers to build API endpoints.

EDUCATION:
- B.S. in Computer Science & Applied Math, University of Washington (2015 – 2019)

SKILLS:
Python, PyTorch, FastAPI, TypeScript, React, PostgreSQL, Docker, Kubernetes, AWS, C++.`,
    linkedinText: `Taylor Smith
Senior Machine Learning Engineer at NeuroTech Systems
Seattle, Washington, United States

Experience:
NeuroTech Systems
Senior Machine Learning Engineer
May 2021 – Present · 3 yrs 4 mos
Seattle, WA

VisionLabs Inc.
Software Engineer
Jun 2019 – May 2021 · 2 yrs
Seattle, WA

Education:
University of Washington
Bachelor of Science, Computer Science & Applied Mathematics
2015 – 2019

Skills:
Python, Machine Learning, FastAPI, PyTorch, PostgreSQL, Docker, TypeScript, React`,
    githubText: `GitHub Profile: taylorsmith-ml
Public Repositories: 22 | Followers: 310 | Commits (Past Year): 920

Repositories:
1. repo: transformer-pruning-toolkit (Python)
   - Stars: 430 | Forks: 52
   - Description: Structured weight pruning and quantization library for HuggingFace Transformers with ONNX runtime export.
   - Key Files: /src/quantization/fp8_engine.py, /src/pruning/structured_sparse.py
   - Recent Commits: "feat(quant): add INT4 weight-only quantization support for LLaMA architecture"

2. repo: fast-onnx-serve (Python / C++)
   - Stars: 195
   - Description: High-throughput async batching inference server using FastAPI and uvloop.

3. repo: annotation-studio-ui (TypeScript / React)
   - Stars: 45
   - Description: Lightweight bounding-box labeling tool built with React and Canvas API.

Languages breakdown:
- Python: 78%
- C++: 12%
- TypeScript: 10%`
  }
];
