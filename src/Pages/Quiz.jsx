import React, { useEffect, useState } from "react";
import "./Quiz.css";

/* ======================================================
   MASTER QUESTION BANK (150 questions across 5 domains)
====================================================== */
// (Your full MASTER_QUESTIONS array remains unchanged — kept exactly as provided)

const MASTER_QUESTIONS = [
  { q: "Best data structure for fast search?", options: ["Array", "Linked List", "Hash Table", "Stack"], answer: "Hash Table", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Purpose of system design interviews?", options: ["Syntax checking", "Scalability thinking", "Academic marks", "Coding speed"], answer: "Scalability thinking", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "CAP theorem relates to?", options: ["Distributed databases", "Operating systems", "Networking protocols", "UI design"], answer: "Distributed databases", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: "O(log n)", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is Big O notation used for?", options: ["Memory usage", "Algorithm efficiency", "Code style", "Debugging"], answer: "Algorithm efficiency", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Which sorting algorithm is stable?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], answer: "Merge Sort", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Primary goal of OOP?", options: ["Speed", "Code reusability", "Low memory", "Simple syntax"], answer: "Code reusability", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Difference between Stack and Queue?", options: ["LIFO vs FIFO", "Size", "Memory location", "Speed"], answer: "LIFO vs FIFO", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What does REST stand for?", options: ["Representational State Transfer", "Remote Server Technology", "Real-time Execution System", "Rapid External Storage"], answer: "Representational State Transfer", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "HTTP status code for 'Not Found'?", options: ["200", "404", "500", "301"], answer: "404", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is a deadlock in OS?", options: ["Infinite loop", "Resource contention cycle", "Memory leak", "Cache miss"], answer: "Resource contention cycle", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Primary key in DBMS ensures?", options: ["Uniqueness", "Sorting", "Indexing speed", "Backup"], answer: "Uniqueness", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is normalization?", options: ["Reduce redundancy", "Increase speed", "Encrypt data", "Compress tables"], answer: "Reduce redundancy", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Difference between SQL and NoSQL?", options: ["Structured vs flexible schema", "Speed vs storage", "Free vs paid", "Local vs cloud"], answer: "Structured vs flexible schema", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is caching?", options: ["Temporary fast storage", "Permanent backup", "Encryption", "Compression"], answer: "Temporary fast storage", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Load balancer does what?", options: ["Distributes traffic", "Stores data", "Authenticates users", "Encrypts connections"], answer: "Distributes traffic", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Microservices communicate via?", options: ["APIs", "Direct memory", "Shared database", "Files"], answer: "APIs", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is CI/CD?", options: ["Continuous Integration & Deployment", "Code Inspection & Debugging", "Cloud Infrastructure Design", "Client Interaction Cycle"], answer: "Continuous Integration & Deployment", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Git command to merge branches?", options: ["git merge", "git pull", "git push", "git commit"], answer: "git merge", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is a race condition?", options: ["Timing-dependent bug", "Memory overflow", "Syntax error", "Network delay"], answer: "Timing-dependent bug", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Difference between TCP and UDP?", options: ["Reliable vs fast", "Encrypted vs plain", "Client vs server", "Wired vs wireless"], answer: "Reliable vs fast", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is DNS?", options: ["Domain Name System", "Data Network Service", "Dynamic Node Server", "Direct Network Storage"], answer: "Domain Name System", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "SSL/TLS is used for?", options: ["Secure communication", "Faster loading", "Caching", "Compression"], answer: "Secure communication", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is sharding?", options: ["Horizontal partitioning", "Vertical scaling", "Backup strategy", "Load testing"], answer: "Horizontal partitioning", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Event-driven architecture uses?", options: ["Message queues", "Direct calls", "Shared memory", "Polling"], answer: "Message queues", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "What is idempotency in APIs?", options: ["Same result on retry", "Faster response", "Encrypted payload", "Compressed data"], answer: "Same result on retry", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Graph database best for?", options: ["Relationships", "Tabular data", "Documents", "Key-value"], answer: "Relationships", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is blue-green deployment?", options: ["Zero-downtime strategy", "A/B testing", "Canary release", "Hotfix"], answer: "Zero-downtime strategy", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Rate limiting prevents?", options: ["Abuse/DoS", "Data loss", "Slow database", "Memory leak"], answer: "Abuse/DoS", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "OAuth is used for?", options: ["Authorization", "Encryption", "Compression", "Caching"], answer: "Authorization", domain: "tech", difficulty: "medium", weight: 2 },
  // ===== DATA (23 → now 30 total) =====
  { q: "Most important skill for Data Science?", options: ["HTML", "Statistics", "Graphic design", "Video editing"], answer: "Statistics", domain: "data", difficulty: "easy", weight: 1 },
  { q: "SQL is primarily used for?", options: ["Styling websites", "Querying relational data", "Training models", "UI design"], answer: "Querying relational data", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Bias-variance tradeoff relates to?", options: ["Model overfitting/underfitting", "UI responsiveness", "Cloud costs", "CI/CD"], answer: "Model overfitting/underfitting", domain: "data", difficulty: "hard", weight: 3 },
  { q: "Pandas is a library for?", options: ["Python data manipulation", "Web scraping", "Game development", "Mobile apps"], answer: "Python data manipulation", domain: "data", difficulty: "easy", weight: 1 },
  { q: "What is data cleaning?", options: ["Handling missing/inconsistent data", "Visualizing charts", "Deploying models", "Collecting data"], answer: "Handling missing/inconsistent data", domain: "data", difficulty: "easy", weight: 1 },
  { q: "EDA stands for?", options: ["Exploratory Data Analysis", "Efficient Data Algorithm", "External Database Access", "Error Detection Automation"], answer: "Exploratory Data Analysis", domain: "data", difficulty: "easy", weight: 1 },
  { q: "Correlation measures?", options: ["Linear relationship", "Causation", "Outliers", "Clustering"], answer: "Linear relationship", domain: "data", difficulty: "medium", weight: 2 },
  { q: "What is overfitting?", options: ["Model too complex on training data", "Too simple model", "Fast training", "Low accuracy"], answer: "Model too complex on training data", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Cross-validation helps prevent?", options: ["Overfitting", "Data leakage", "Slow training", "High bias"], answer: "Overfitting", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Feature engineering means?", options: ["Creating better input features", "Selecting hardware", "Deploying model", "Visualizing data"], answer: "Creating better input features", domain: "data", difficulty: "medium", weight: 2 },
  { q: "What is a confusion matrix?", options: ["Evaluation for classification", "Data storage", "Visualization tool", "Clustering method"], answer: "Evaluation for classification", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Precision vs Recall trade-off in?", options: ["Imbalanced classification", "Regression", "Clustering", "Dimensionality reduction"], answer: "Imbalanced classification", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is PCA?", options: ["Dimensionality reduction", "Clustering", "Regression", "Neural network"], answer: "Dimensionality reduction", domain: "data", difficulty: "hard", weight: 3 },
  { q: "A/B testing is used for?", options: ["Comparing variants", "Training models", "Cleaning data", "Storing results"], answer: "Comparing variants", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Time series forecasting uses?", options: ["ARIMA, LSTM", "K-Means", "Decision Trees", "SVM"], answer: "ARIMA, LSTM", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is outlier detection?", options: ["Identifying anomalous points", "Removing duplicates", "Scaling features", "Encoding categories"], answer: "Identifying anomalous points", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Imputation handles?", options: ["Missing values", "Outliers", "Duplicates", "Class imbalance"], answer: "Missing values", domain: "data", difficulty: "easy", weight: 1 },
  { q: "What is regularization?", options: ["Prevents overfitting", "Speeds training", "Increases accuracy", "Reduces features"], answer: "Prevents overfitting", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Ensemble learning combines?", options: ["Multiple models", "Single strong model", "Only trees", "Only neural nets"], answer: "Multiple models", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Random Forest is an example of?", options: ["Bagging", "Boosting", "Stacking", "Clustering"], answer: "Bagging", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Gradient Boosting improves by?", options: ["Focusing on errors", "Random sampling", "Parallel trees", "Feature selection"], answer: "Focusing on errors", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is feature scaling?", options: ["Normalization/Standardization", "Selection", "Engineering", "Encoding"], answer: "Normalization/Standardization", domain: "data", difficulty: "easy", weight: 1 },
  { q: "ROC-AUC evaluates?", options: ["Classification threshold independence", "Regression error", "Clustering quality", "Time series"], answer: "Classification threshold independence", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is data leakage?", options: ["Training info in test", "Missing values", "High variance", "Low bias"], answer: "Training info in test", domain: "data", difficulty: "hard", weight: 3 },
  { q: "SMOTE is used for?", options: ["Class imbalance", "Dimensionality reduction", "Outlier removal", "Feature selection"], answer: "Class imbalance", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is clustering?", options: ["Unsupervised grouping", "Supervised classification", "Regression", "Dimensionality reduction"], answer: "Unsupervised grouping", domain: "data", difficulty: "medium", weight: 2 },
  { q: "K-Means is sensitive to?", options: ["Outliers & initialization", "Labels", "Time order", "Categorical data"], answer: "Outliers & initialization", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Silhouette score measures?", options: ["Clustering quality", "Regression error", "Classification accuracy", "Feature importance"], answer: "Clustering quality", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is ETL?", options: ["Extract, Transform, Load", "Evaluate, Train, Learn", "Encrypt, Transfer, Log", "Explore, Test, Launch"], answer: "Extract, Transform, Load", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Data warehouse is for?", options: ["Analytics & reporting", "Real-time transactions", "Small datasets", "Unstructured logs"], answer: "Analytics & reporting", domain: "data", difficulty: "medium", weight: 2 },
  { q: "AWS EC2 provides?", options: ["Virtual servers", "Object storage", "Database", "DNS"], answer: "Virtual servers", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "Docker creates?", options: ["Containers", "Virtual machines", "Bare metal servers", "Databases"], answer: "Containers", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Kubernetes primarily manages?", options: ["Container orchestration", "Virtual machines", "Databases", "Networking"], answer: "Container orchestration", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Serverless computing means?", options: ["No server management", "Physical servers", "Only VMs", "Local hosting"], answer: "No server management", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "AWS S3 is for?", options: ["Object storage", "Block storage", "Compute", "Database"], answer: "Object storage", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "VPC stands for?", options: ["Virtual Private Cloud", "Very Powerful Computer", "Virtual Public Container", "Volume Performance Cache"], answer: "Virtual Private Cloud", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "IAM in cloud controls?", options: ["Access & permissions", "Compute resources", "Storage", "Networking"], answer: "Access & permissions", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "Auto-scaling adjusts?", options: ["Resources based on load", "Fixed instances", "Manual only", "Storage only"], answer: "Resources based on load", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "CDN stands for?", options: ["Content Delivery Network", "Cloud Data Node", "Central Database Network", "Compute Distribution Node"], answer: "Content Delivery Network", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Lambda functions run?", options: ["On-demand code", "Always running", "Only VMs", "Local only"], answer: "On-demand code", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "RDS provides?", options: ["Managed relational databases", "Object storage", "Compute", "DNS"], answer: "Managed relational databases", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Elastic Load Balancer does?", options: ["Distributes traffic", "Stores data", "Runs containers", "Manages DNS"], answer: "Distributes traffic", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "CloudFormation/Terraform for?", options: ["Infrastructure as Code", "Monitoring", "Logging", "Billing"], answer: "Infrastructure as Code", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Multi-AZ deployment for?", options: ["High availability", "Cost reduction", "Speed", "Security"], answer: "High availability", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "What is hybrid cloud?", options: ["On-prem + public cloud", "Only public", "Only private", "Only edge"], answer: "On-prem + public cloud", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Edge computing processes?", options: ["Near data source", "Central cloud only", "On-prem only", "Client device"], answer: "Near data source", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "SLA means?", options: ["Service Level Agreement", "System Load Average", "Secure Login Access", "Storage Limit Allocation"], answer: "Service Level Agreement", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "Shared responsibility model defines?", options: ["Security duties split", "Cost sharing", "Performance", "Bandwidth"], answer: "Security duties split", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Regions vs Availability Zones?", options: ["Geographic vs isolated", "Same location", "Cost difference", "Speed"], answer: "Geographic vs isolated", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Reserved Instances save?", options: ["Cost with commitment", "Performance", "Latency", "Bandwidth"], answer: "Cost with commitment", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Snowball is for?", options: ["Large data transfer", "Compute", "Streaming", "DNS"], answer: "Large data transfer", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "CloudWatch monitors?", options: ["Metrics & logs", "Billing", "Security", "DNS"], answer: "Metrics & logs", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "What is lift-and-shift?", options: ["Rehosting to cloud", "Refactoring", "New build", "Hybrid"], answer: "Rehosting to cloud", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "12 Factor App methodology for?", options: ["Cloud-native apps", "Monoliths", "Desktop", "Embedded"], answer: "Cloud-native apps", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Service mesh (Istio) manages?", options: ["Microservice communication", "Storage", "Compute", "DNS"], answer: "Microservice communication", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Spot Instances are?", options: ["Cheaper, interruptible", "Dedicated", "Reserved", "On-demand"], answer: "Cheaper, interruptible", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Direct Connect provides?", options: ["Private network link", "Public internet", "VPN only", "WiFi"], answer: "Private network link", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "GuardDuty is for?", options: ["Threat detection", "Encryption", "Backup", "Scaling"], answer: "Threat detection", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "EKS manages?", options: ["Kubernetes clusters", "Virtual machines", "Databases", "Storage"], answer: "Kubernetes clusters", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "What is canary deployment?", options: ["Gradual rollout", "All at once", "Blue-green", "Rollback only"], answer: "Gradual rollout", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Most valued soft skill in MNCs?", options: ["Communication", "Gaming", "Fast typing", "Drawing"], answer: "Communication", domain: "business", difficulty: "easy", weight: 1 },
  { q: "KPIs are used to?", options: ["Measure performance", "Design UI", "Write code", "Deploy servers"], answer: "Measure performance", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Product-market fit means?", options: ["Product meets market demand", "Good marketing", "Beautiful UI", "High sales"], answer: "Product meets market demand", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Agile methodology focuses on?", options: ["Iterative delivery", "Long planning", "Fixed scope", "Waterfall"], answer: "Iterative delivery", domain: "business", difficulty: "easy", weight: 1 },
  { q: "Scrum uses?", options: ["Sprints & roles", "Gantt charts", "Yearly plans", "Fixed teams"], answer: "Sprints & roles", domain: "business", difficulty: "medium", weight: 2 },
  { q: "MVP stands for?", options: ["Minimum Viable Product", "Most Valuable Player", "Maximum Value Proposition", "Market Validation Plan"], answer: "Minimum Viable Product", domain: "business", difficulty: "easy", weight: 1 },
  { q: "Stakeholder is?", options: ["Anyone impacted by project", "Only client", "Only team", "Only manager"], answer: "Anyone impacted by project", domain: "business", difficulty: "easy", weight: 1 },
  { q: "OKRs stand for?", options: ["Objectives & Key Results", "Operational Key Resources", "Organizational Knowledge Review", "Output & Key Revenue"], answer: "Objectives & Key Results", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Customer journey map shows?", options: ["User experience flow", "Code flow", "Server architecture", "Database schema"], answer: "User experience flow", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Burn-down chart tracks?", options: ["Remaining work", "Team velocity", "Defects", "Revenue"], answer: "Remaining work", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Lean startup emphasizes?", options: ["Build-Measure-Learn", "Plan-Execute-Scale", "Design-Code-Test", "Sell-Market-Grow"], answer: "Build-Measure-Learn", domain: "business", difficulty: "hard", weight: 3 },
  { q: "SWOT analysis includes?", options: ["Strengths, Weaknesses, Opportunities, Threats", "Sales, Work, Operations, Targets", "Strategy, Workflow, Output, Team", "Scope, Work, Objectives, Tasks"], answer: "Strengths, Weaknesses, Opportunities, Threats", domain: "business", difficulty: "easy", weight: 1 },
  { q: "North Star Metric is?", options: ["Single key growth metric", "Revenue only", "User count", "Profit"], answer: "Single key growth metric", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Churn rate measures?", options: ["Customer loss", "New signups", "Revenue growth", "Profit"], answer: "Customer loss", domain: "business", difficulty: "medium", weight: 2 },
  { q: "LTV means?", options: ["Customer Lifetime Value", "Long Term Vision", "Lead to Value", "Launch Time Value"], answer: "Customer Lifetime Value", domain: "business", difficulty: "medium", weight: 2 },
  { q: "CAC is?", options: ["Customer Acquisition Cost", "Cloud Access Control", "Content Approval Cycle", "Career Advancement Credit"], answer: "Customer Acquisition Cost", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Growth hacking focuses on?", options: ["Rapid low-cost growth", "Traditional marketing", "TV ads", "Print media"], answer: "Rapid low-cost growth", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Pivot in startup means?", options: ["Strategic direction change", "More funding", "Hiring", "Office move"], answer: "Strategic direction change", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Moat refers to?", options: ["Competitive advantage", "Office building", "Funding round", "Team size"], answer: "Competitive advantage", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Retention is more important than?", options: ["Acquisition", "Marketing spend", "Features", "Design"], answer: "Acquisition", domain: "business", difficulty: "medium", weight: 2 },
  { q: "User persona represents?", options: ["Ideal customer archetype", "Real user", "Employee", "Investor"], answer: "Ideal customer archetype", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Feature creep means?", options: ["Adding too many features", "Fast development", "Bug fixing", "Deployment"], answer: "Adding too many features", domain: "business", difficulty: "medium", weight: 2 },
  { q: "RICE scoring prioritizes by?", options: ["Reach, Impact, Confidence, Effort", "Revenue, Innovation, Cost, Execution", "Risk, Importance, Complexity, Ease", "Return, Investment, Capability, Efficiency"], answer: "Reach, Impact, Confidence, Effort", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Jobs to be Done framework focuses on?", options: ["Customer goals", "Product features", "Price", "Marketing"], answer: "Customer goals", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Virality coefficient >1 means?", options: ["Exponential growth", "Linear growth", "Decline", "Stable"], answer: "Exponential growth", domain: "business", difficulty: "hard", weight: 3 },
  { q: "AARRR framework stands for?", options: ["Acquisition, Activation, Retention, Referral, Revenue", "Analysis, Action, Review, Report, Repeat", "Awareness, Acquisition, Revenue, Retention, Referral", "Attract, Acquire, Retain, Refer, Revenue"], answer: "Acquisition, Activation, Retention, Referral, Revenue", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Cross-functional team includes?", options: ["Multiple disciplines", "Only developers", "Only designers", "Only managers"], answer: "Multiple disciplines", domain: "business", difficulty: "easy", weight: 1 },
  { q: "Technical debt refers to?", options: ["Shortcuts in code quality", "Financial loan", "Server cost", "Cloud bill"], answer: "Shortcuts in code quality", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Northbound traction means?", options: ["Top-down adoption", "Bottom-up", "Sideways", "External"], answer: "Top-down adoption", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Bottom-up adoption is?", options: ["Users drive adoption", "Management mandates", "Sales team", "Marketing"], answer: "Users drive adoption", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Supervised learning requires?", options: ["Labeled data", "Unlabeled data", "Rewards", "Clusters"], answer: "Labeled data", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "CNNs are best suited for?", options: ["Image processing", "Tabular data", "Text sequences", "Time series"], answer: "Image processing", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Vanishing gradient problem commonly occurs in?", options: ["Deep neural networks", "Linear models", "Decision trees", "K-Means"], answer: "Deep neural networks", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "The core mechanism of Transformer architecture is?", options: ["Attention mechanism", "Convolution", "Recurrence", "Pooling only"], answer: "Attention mechanism", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "BERT is primarily pre-trained using?", options: ["Masked language modeling", "Image classification", "Reinforcement tasks", "Clustering"], answer: "Masked language modeling", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Reinforcement learning primarily uses?", options: ["Rewards & actions", "Labeled data", "Feature vectors", "Clusters"], answer: "Rewards & actions", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "A GAN consists of which two components?", options: ["Generator & Discriminator", "Encoder & Decoder", "Two classifiers", "Autoencoder only"], answer: "Generator & Discriminator", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Transfer learning typically reuses?", options: ["Pre-trained models", "Random weights", "Small datasets", "New architecture"], answer: "Pre-trained models", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "LSTMs were specifically designed to handle?", options: ["Sequential data", "Images", "Tabular data", "Graph structures"], answer: "Sequential data", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "The ReLU activation function is defined as?", options: ["f(x) = max(0, x)", "f(x) = 1/(1+e^-x)", "f(x) = (e^x - e^-x)/(e^x + e^-x)", "f(x) = x"], answer: "f(x) = max(0, x)", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "Dropout is commonly used to prevent?", options: ["Overfitting", "Underfitting", "Slow convergence", "Vanishing gradients"], answer: "Overfitting", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Backpropagation is used to compute?", options: ["Gradients", "Predictions", "Feature importance", "Clusters"], answer: "Gradients", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "One epoch means?", options: ["One full pass through the training data", "One batch update", "One layer training", "One neuron update"], answer: "One full pass through the training data", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "Batch size primarily affects?", options: ["Training stability & speed", "Model architecture", "Dataset size", "Activation choice"], answer: "Training stability & speed", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Fine-tuning refers to?", options: ["Adjusting a pre-trained model on new data", "Training from scratch", "Freezing all layers", "Data cleaning"], answer: "Adjusting a pre-trained model on new data", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Prompt engineering is the practice of?", options: ["Crafting effective inputs for LLMs", "Building new models", "Deploying APIs", "Labeling data"], answer: "Crafting effective inputs for LLMs", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "RAG stands for?", options: ["Retrieval Augmented Generation", "Random Attention Graph", "Recurrent Autoencoder Graph", "Reinforcement Agent Guidance"], answer: "Retrieval Augmented Generation", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Hallucination in large language models means?", options: ["Generating plausible but false information", "Slow response time", "High accuracy", "Low latency"], answer: "Generating plausible but false information", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Zero-shot learning means?", options: ["No training examples for the task", "One example", "Few examples", "Many examples"], answer: "No training examples for the task", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Diffusion models are primarily used for?", options: ["Image generation", "Classification", "Regression", "Clustering"], answer: "Image generation", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Tokenization in NLP refers to?", options: ["Splitting text into tokens", "Compressing data", "Encrypting text", "Labeling entities"], answer: "Splitting text into tokens", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "Self-attention mechanism allows the model to?", options: ["Weigh importance of different words", "Reduce dimensions", "Increase inference speed", "Compress embeddings"], answer: "Weigh importance of different words", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Chain-of-thought prompting encourages?", options: ["Step-by-step reasoning", "Short direct answers", "Image inputs", "Code execution"], answer: "Step-by-step reasoning", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Federated learning trains models on?", options: ["Decentralized data without sharing it", "Central server only", "Public datasets only", "Cloud storage"], answer: "Decentralized data without sharing it", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Model quantization primarily reduces?", options: ["Model size and inference speed", "Training time only", "Accuracy only", "Dataset size"], answer: "Model size and inference speed", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Few-shot learning involves?", options: ["Providing a few examples in the prompt", "No examples", "Many examples", "Unlabeled data"], answer: "Providing a few examples in the prompt", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "An autoencoder is commonly used for?", options: ["Dimensionality reduction & anomaly detection", "Classification only", "Regression only", "Image generation only"], answer: "Dimensionality reduction & anomaly detection", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Gradient descent updates model parameters using?", options: ["Loss gradient direction", "Random search", "Feature importance", "Hyperparameter grid"], answer: "Loss gradient direction", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "The Adam optimizer combines benefits of?", options: ["Momentum & adaptive learning rates", "Only momentum", "Only RMSProp", "Basic SGD only"], answer: "Momentum & adaptive learning rates", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Multimodal AI models can process?", options: ["Multiple data types (text, image, audio)", "Text only", "Image only", "Audio only"], answer: "Multiple data types (text, image, audio)", domain: "ai", difficulty: "medium", weight: 2 },
  // ==================== CYBER (Cyber Security) ====================
  { q: "Most common attack vector today?", options: ["Phishing", "DDoS", "SQL Injection", "Brute Force"], answer: "Phishing", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "CIA triad stands for?", options: ["Confidentiality, Integrity, Availability", "Control, Impact, Assessment", "Cyber, Intelligence, Action", "Cryptography, Intrusion, Attack"], answer: "Confidentiality, Integrity, Availability", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Zero Trust model assumes?", options: ["Verify every request", "Trust internal network", "Block external only", "Allow by default"], answer: "Verify every request", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "OWASP Top 10 includes?", options: ["Injection, Broken Auth", "Slow loading", "Poor UI", "High cost"], answer: "Injection, Broken Auth", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "MFA stands for?", options: ["Multi-Factor Authentication", "Main Frame Access", "Mobile First Architecture", "Multi Firewall Attack"], answer: "Multi-Factor Authentication", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Encryption at rest protects?", options: ["Stored data", "Data in transit", "Running code", "Network traffic"], answer: "Stored data", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "SIEM tools are used for?", options: ["Log monitoring & alerts", "Code deployment", "UI testing", "Cloud billing"], answer: "Log monitoring & alerts", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "VPN provides?", options: ["Encrypted tunnel", "Faster internet", "Free WiFi", "Ad blocking"], answer: "Encrypted tunnel", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Firewall operates at which OSI layer?", options: ["Layer 3/4", "Layer 7 only", "Layer 1", "Application"], answer: "Layer 3/4", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "XSS attack targets?", options: ["Client-side scripts", "Database", "Server memory", "Network"], answer: "Client-side scripts", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Common hashing algorithm for passwords?", options: ["bcrypt", "MD5", "SHA-1", "Base64"], answer: "bcrypt", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "GDPR is related to?", options: ["Data privacy", "Cloud pricing", "AI ethics", "Open source"], answer: "Data privacy", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Least privilege principle means?", options: ["Minimal access needed", "Full access", "Admin by default", "Guest access"], answer: "Minimal access needed", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "WAF protects against?", options: ["Web attacks", "DDoS only", "Malware", "Insider threats"], answer: "Web attacks", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Blue team in cybersecurity does?", options: ["Defense", "Attack simulation", "Pen testing", "Bug bounty"], answer: "Defense", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Red team does?", options: ["Simulate real attacks", "Monitor logs", "Patch systems", "Write policies"], answer: "Simulate real attacks", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Penetration testing is also known as?", options: ["Ethical hacking", "Code review", "Load testing", "UI testing"], answer: "Ethical hacking", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "SOC stands for?", options: ["Security Operations Center", "System on Chip", "Service Operation Control", "Secure Online Cloud"], answer: "Security Operations Center", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Ransomware typically demands payment in?", options: ["Cryptocurrency", "Cash", "Credit card", "Bank transfer"], answer: "Cryptocurrency", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "DLP stands for?", options: ["Data Loss Prevention", "Deep Learning Platform", "Digital License Protection", "Domain Link Protocol"], answer: "Data Loss Prevention", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Supply chain attack example?", options: ["SolarWinds", "DDoS", "Phishing email", "Brute force"], answer: "SolarWinds", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Common tool for network scanning?", options: ["Nmap", "Wireshark", "Burp Suite", "Metasploit"], answer: "Nmap", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Threat hunting is?", options: ["Proactive search for threats", "Reactive incident response", "Patch management", "Backup"], answer: "Proactive search for threats", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "SOC 2 compliance is for?", options: ["Service organizations", "Government", "Startups only", "Hardware"], answer: "Service organizations", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "PKI uses?", options: ["Public/private keys", "Passwords only", "Biometrics", "Tokens"], answer: "Public/private keys", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Most secure protocol for remote access?", options: ["SSH", "Telnet", "FTP", "RDP"], answer: "SSH", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Hashing is?", options: ["One-way function", "Reversible", "Encryption", "Compression"], answer: "One-way function", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Common web vulnerability?", options: ["CSRF", "Slow API", "Poor design", "High traffic"], answer: "CSRF", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Incident response steps include?", options: ["Preparation, Detection, Containment", "Code, Test, Deploy", "Plan, Do, Check", "Build, Measure, Learn"], answer: "Preparation, Detection, Containment", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Endpoint Detection & Response (EDR) monitors?", options: ["Devices", "Network only", "Cloud only", "Servers only"], answer: "Devices", domain: "cyber", difficulty: "medium", weight: 2 },
  // ==================== MARKETING (Digital Marketing) ====================
  { q: "SEO stands for?", options: ["Search Engine Optimization", "Social Engagement Online", "Sales Enablement Outreach", "Server Error Override"], answer: "Search Engine Optimization", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Primary goal of content marketing?", options: ["Build trust & authority", "Direct sales", "Viral memes", "Paid ads"], answer: "Build trust & authority", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "CTR means?", options: ["Click-Through Rate", "Cost To Revenue", "Customer Trust Rating", "Conversion Target Ratio"], answer: "Click-Through Rate", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "A/B testing is used for?", options: ["Optimizing conversions", "Coding websites", "Training models", "Deploying servers"], answer: "Optimizing conversions", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Funnel stages include?", options: ["Awareness, Consideration, Conversion", "Code, Test, Deploy", "Plan, Do, Check", "Build, Measure, Learn"], answer: "Awareness, Consideration, Conversion", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Google Analytics tracks?", options: ["User behavior", "Stock prices", "Weather", "Code errors"], answer: "User behavior", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Email open rate is affected by?", options: ["Subject line", "Server speed", "Database size", "Code quality"], answer: "Subject line", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "ROAS stands for?", options: ["Return on Ad Spend", "Revenue Over Average Sales", "Reach Over Audience Size", "Risk of Ad Strategy"], answer: "Return on Ad Spend", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Influencer marketing leverages?", options: ["Social proof", "Paid search", "TV ads", "Billboards"], answer: "Social proof", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Customer persona represents?", options: ["Ideal buyer profile", "Real customer", "Employee", "Investor"], answer: "Ideal buyer profile", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Conversion rate optimization focuses on?", options: ["Turning visitors into customers", "Increasing traffic", "Reducing bounce rate only", "Building brand"], answer: "Turning visitors into customers", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "PPC means?", options: ["Pay Per Click", "Post Per Comment", "Page Per Conversion", "Product Price Comparison"], answer: "Pay Per Click", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Remarketing targets?", options: ["Previous website visitors", "New users only", "Competitors", "Random audience"], answer: "Previous website visitors", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Organic traffic comes from?", options: ["Unpaid search results", "Paid ads", "Social media only", "Email"], answer: "Unpaid search results", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Bounce rate measures?", options: ["Single-page sessions", "Time on site", "Pages per session", "Conversion rate"], answer: "Single-page sessions", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Lead magnet is?", options: ["Free value for email", "Paid product", "Social post", "Ad creative"], answer: "Free value for email", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Viral coefficient >1 means?", options: ["Exponential growth", "Linear growth", "Decline", "Stable"], answer: "Exponential growth", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Customer Lifetime Value (CLV) helps?", options: ["Predict long-term revenue", "Daily sales", "Ad cost", "Bounce rate"], answer: "Predict long-term revenue", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Growth hacking combines?", options: ["Marketing + data + creativity", "Sales + HR", "Finance + ops", "Design + legal"], answer: "Marketing + data + creativity", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "North Star Metric is?", options: ["Single key growth metric", "Revenue only", "User count", "Profit"], answer: "Single key growth metric", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Churn rate measures?", options: ["Customer loss", "New signups", "Revenue growth", "Ad spend"], answer: "Customer loss", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "CAC is?", options: ["Customer Acquisition Cost", "Cloud Access Control", "Content Approval Cycle", "Career Advancement Credit"], answer: "Customer Acquisition Cost", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "LTV:CAC ratio should ideally be?", options: ["3:1 or higher", "1:1", "1:3", "10:1"], answer: "3:1 or higher", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Omnichannel marketing means?", options: ["Seamless experience across channels", "Only online", "Only offline", "Single channel"], answer: "Seamless experience across channels", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Brand equity refers to?", options: ["Value of brand name", "Stock price", "Ad budget", "Sales volume"], answer: "Value of brand name", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "NPS measures?", options: ["Customer loyalty", "Sales growth", "Ad performance", "Website speed"], answer: "Customer loyalty", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Affiliate marketing pays for?", options: ["Referrals & sales", "Clicks only", "Impressions", "Likes"], answer: "Referrals & sales", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "User-generated content builds?", options: ["Authenticity & trust", "Paid traffic", "SEO only", "Ad revenue"], answer: "Authenticity & trust", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Dark funnel refers to?", options: ["Untrackable buyer journey", "Black hat SEO", "Hidden ads", "Underground sales"], answer: "Untrackable buyer journey", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Marketing automation helps with?", options: ["Lead nurturing", "Manual emails", "Cold calling", "Print ads"], answer: "Lead nurturing", domain: "marketing", difficulty: "medium", weight: 2 },
  // ==================== DESIGN (UI/UX & Graphic Design) ====================
  { q: "Figma is used for?", options: ["UI/UX design", "Coding", "Data analysis", "Cloud deployment"], answer: "UI/UX design", domain: "design", difficulty: "easy", weight: 1 },
  { q: "User persona helps?", options: ["Understand target users", "Write code", "Deploy servers", "Run ads"], answer: "Understand target users", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Wireframe is?", options: ["Low-fidelity layout", "Final design", "Coded page", "3D model"], answer: "Low-fidelity layout", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Golden ratio in design is approximately?", options: ["1.618", "1.5", "2", "1"], answer: "1.618", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Accessibility includes?", options: ["Color contrast, alt text", "Fancy animations", "Complex navigation", "Small text"], answer: "Color contrast, alt text", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Material Design is by?", options: ["Google", "Apple", "Microsoft", "Adobe"], answer: "Google", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Hick's Law says?", options: ["More choices = slower decision", "Less choices = confusion", "Color affects speed", "Size matters most"], answer: "More choices = slower decision", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Microinteractions enhance?", options: ["User delight", "Page speed", "SEO", "Ad revenue"], answer: "User delight", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Responsive design adapts to?", options: ["Screen size", "User age", "Location", "Time"], answer: "Screen size", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Design thinking process includes?", options: ["Empathize, Define, Ideate, Prototype, Test", "Code, Test, Deploy", "Plan, Execute, Review", "Sell, Market, Grow"], answer: "Empathize, Define, Ideate, Prototype, Test", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Color psychology: Blue represents?", options: ["Trust & calm", "Energy & passion", "Growth & health", "Luxury & power"], answer: "Trust & calm", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Typography hierarchy improves?", options: ["Readability", "Loading speed", "SEO ranking", "Ad clicks"], answer: "Readability", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Dark mode saves battery on?", options: ["OLED screens", "LCD screens", "All screens", "No screens"], answer: "OLED screens", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Gestalt principle of proximity means?", options: ["Close elements appear related", "Similar colors group", "Large items dominate", "Motion attracts attention"], answer: "Close elements appear related", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Adobe XD is for?", options: ["Prototyping", "Video editing", "3D modeling", "Music production"], answer: "Prototyping", domain: "design", difficulty: "easy", weight: 1 },
  { q: "User flow maps?", options: ["User journey through app", "Data flow", "Money flow", "Server flow"], answer: "User journey through app", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Neumorphism uses?", options: ["Soft shadows", "Flat colors", "Bold gradients", "Skeuomorphic textures"], answer: "Soft shadows", domain: "design", difficulty: "hard", weight: 3 },
  { q: "WCAG stands for?", options: ["Web Content Accessibility Guidelines", "World Class Animation Group", "Web Color and Graphics", "Wireless Connectivity Association"], answer: "Web Content Accessibility Guidelines", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Brutalism in design features?", options: ["Raw, unpolished look", "Minimalism", "Elegant curves", "Pastel colors"], answer: "Raw, unpolished look", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Card sorting helps with?", options: ["Information architecture", "Color palette", "Animation timing", "Font selection"], answer: "Information architecture", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Affordance in design means?", options: ["Object suggests use", "Beautiful appearance", "Fast loading", "High contrast"], answer: "Object suggests use", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Glassmorphism uses?", options: ["Blurred background", "Solid colors", "Sharp edges", "3D shadows"], answer: "Blurred background", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Design sprint lasts?", options: ["5 days", "1 week", "1 month", "3 months"], answer: "5 days", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Mood board is used for?", options: ["Visual direction", "User testing", "Coding", "Marketing"], answer: "Visual direction", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Progressive disclosure shows?", options: ["Information gradually", "All at once", "Nothing", "Only errors"], answer: "Information gradually", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Skeuomorphism mimics?", options: ["Real-world objects", "Flat icons", "Abstract shapes", "Code structure"], answer: "Real-world objects", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Heatmap shows?", options: ["User attention areas", "Server heat", "Color temperature", "Traffic sources"], answer: "User attention areas", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Mobile-first design starts with?", options: ["Smallest screen", "Largest screen", "Desktop only", "Print"], answer: "Smallest screen", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Design system includes?", options: ["Reusable components", "One-off designs", "Random colors", "Different fonts"], answer: "Reusable components", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Framer is used for?", options: ["Interactive prototypes", "Static images", "Backend code", "Database"], answer: "Interactive prototypes", domain: "design", difficulty: "easy", weight: 1 },
  // ==================== MANAGEMENT (Project & General Management) ====================
  { q: "Agile methodology focuses on?", options: ["Iterative delivery", "Long planning", "Fixed scope", "Waterfall"], answer: "Iterative delivery", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Scrum uses?", options: ["Sprints & roles", "Gantt charts", "Yearly plans", "Fixed teams"], answer: "Sprints & roles", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Kanban visualizes?", options: ["Work flow", "Financial reports", "Code structure", "Server logs"], answer: "Work flow", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Critical path in project shows?", options: ["Longest sequence of tasks", "Shortest path", "Cheapest tasks", "Easiest tasks"], answer: "Longest sequence of tasks", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Stakeholder management involves?", options: ["Communication & expectations", "Coding", "Design", "Marketing"], answer: "Communication & expectations", domain: "management", difficulty: "medium", weight: 2 },
  { q: "RACI matrix defines?", options: ["Responsible, Accountable, Consulted, Informed", "Risk, Action, Control, Impact", "Resource, Activity, Cost, Income", "Requirement, Analysis, Change, Implementation"], answer: "Responsible, Accountable, Consulted, Informed", domain: "management", difficulty: "hard", weight: 3 },
  { q: "SWOT analysis includes?", options: ["Strengths, Weaknesses, Opportunities, Threats", "Sales, Work, Operations, Targets", "Strategy, Workflow, Output, Team", "Scope, Work, Objectives, Tasks"], answer: "Strengths, Weaknesses, Opportunities, Threats", domain: "management", difficulty: "easy", weight: 1 },
  { q: "OKRs stand for?", options: ["Objectives & Key Results", "Operational Key Resources", "Organizational Knowledge Review", "Output & Key Revenue"], answer: "Objectives & Key Results", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Burn-down chart tracks?", options: ["Remaining work", "Team velocity", "Defects", "Revenue"], answer: "Remaining work", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Risk register documents?", options: ["Potential risks", "Completed tasks", "Team salaries", "Marketing budget"], answer: "Potential risks", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Gantt chart shows?", options: ["Timeline & dependencies", "Financial data", "User feedback", "Code quality"], answer: "Timeline & dependencies", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Change management deals with?", options: ["People side of change", "Technical upgrades only", "Budget changes", "Location moves"], answer: "People side of change", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Triple constraint includes?", options: ["Scope, Time, Cost", "Quality, Risk, Resources", "Team, Tools, Training", "Plan, Do, Check, Act"], answer: "Scope, Time, Cost", domain: "management", difficulty: "medium", weight: 2 },
  { q: "PMBOK is?", options: ["Project Management Body of Knowledge", "Product Marketing Book", "Programming Methodology", "Personal Management Basics"], answer: "Project Management Body of Knowledge", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Retrospective meeting is for?", options: ["Continuous improvement", "Celebration", "Planning next phase", "Budget review"], answer: "Continuous improvement", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Velocity in Scrum measures?", options: ["Team capacity", "Individual performance", "Bug count", "Revenue"], answer: "Team capacity", domain: "management", difficulty: "medium", weight: 2 },
  { q: "MVP in project means?", options: ["Minimum Viable Product", "Most Valuable Player", "Maximum Value Plan", "Management Vision Presentation"], answer: "Minimum Viable Product", domain: "management", difficulty: "easy", weight: 1 },
  { q: "RAID log tracks?", options: ["Risks, Actions, Issues, Decisions", "Revenue, Assets, Income, Debt", "Resources, Activities, Inputs, Deliverables", "Requirements, Analysis, Implementation, Design"], answer: "Risks, Actions, Issues, Decisions", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Servant leadership in management means?", options: ["Supporting team success", "Command & control", "Micromanagement", "Top-down decisions"], answer: "Supporting team success", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Conflict resolution technique: Win-Win is?", options: ["Collaboration", "Compromise", "Avoidance", "Competition"], answer: "Collaboration", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Earned Value Management measures?", options: ["Project performance", "Team happiness", "Marketing reach", "Sales growth"], answer: "Project performance", domain: "management", difficulty: "hard", weight: 3 },
  { q: "MoSCoW prioritization uses?", options: ["Must, Should, Could, Won't", "Money, Scope, Cost, Quality", "Market, Sales, Customers, Operations", "Manage, Organize, Schedule, Control"], answer: "Must, Should, Could, Won't", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Lessons learned are captured?", options: ["At project end", "Only at beginning", "Never", "During marketing"], answer: "At project end", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Resource leveling avoids?", options: ["Over-allocation", "Under-budget", "Scope creep", "Technical debt"], answer: "Over-allocation", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Agile manifesto values?", options: ["Individuals & interactions over processes", "Comprehensive documentation", "Contract negotiation", "Following a plan"], answer: "Individuals & interactions over processes", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Sprint review is for?", options: ["Demonstrating work", "Planning next sprint", "Retrospective", "Daily standup"], answer: "Demonstrating work", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Product backlog is owned by?", options: ["Product Owner", "Scrum Master", "Team", "Stakeholder"], answer: "Product Owner", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Definition of Done ensures?", options: ["Quality standards met", "Work completed fast", "Client happy", "Budget saved"], answer: "Quality standards met", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Hybrid methodology combines?", options: ["Agile + Waterfall", "Scrum + Kanban", "Lean + Six Sigma", "All of above"], answer: "Agile + Waterfall", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Emotional intelligence in leadership includes?", options: ["Self-awareness, empathy", "Technical skills", "Coding ability", "Financial knowledge"], answer: "Self-awareness, empathy", domain: "management", difficulty: "medium", weight: 2 },
  


  
];

/* ======================================================
   UTILITIES
====================================================== */


const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const getDifficultyByRound = (round) =>
  round === 1 ? "easy" : round === 2 ? "medium" : "hard";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Quiz() {
  const [stage, setStage] = useState("selection"); // "selection" | "quiz" | "results"
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [round, setRound] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completed, setCompleted] = useState(false);

  const [scores, setScores] = useState({
    tech: 0,
    data: 0,
    ai: 0,
    cloud: 0,
    business: 0,
  });

  const totalQuestionsPerRound = 15;
  const maxRounds = 3;

const domainInfo = {
  tech: { name: "Software Engineering", icon: "💻", color: "#4f46e5" },
  data: { name: "Data Science & Analytics", icon: "📊", color: "#10b981" },
  ai: { name: "AI / Machine Learning", icon: "🤖", color: "#f59e0b" },
  cloud: { name: "Cloud & DevOps", icon: "☁️", color: "#06b6d4" },
  business: { name: "Product & Business", icon: "🚀", color: "#a855f7" },
  cyber: { name: "Cyber Security", icon: "🔒", color: "#dc2626" },
  marketing: { name: "Digital Marketing", icon: "📈", color: "#f59e0b" },
  design: { name: "UI/UX & Design", icon: "🎨", color: "#ec4899" },
  management: { name: "Project Management", icon: "📋", color: "#6366f1" },
};

  /* ======================
     DOMAIN SELECTION
  ======================= */
  const toggleDomain = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );
  };

  const startQuiz = () => {
    if (selectedDomains.length === 0) {
      alert("Please select at least one domain you're interested in!");
      return;
    }
    setStage("quiz");
  };

  /* ======================
     Initialize Round Questions (Filtered by selected domains)
  ======================= */
  useEffect(() => {
    if (stage !== "quiz") return;

    const difficulty = getDifficultyByRound(round);

    // Filter questions by selected domains AND difficulty
    let filtered = MASTER_QUESTIONS.filter(
      (q) => selectedDomains.includes(q.domain) && q.difficulty === difficulty
    );

    if (filtered.length < totalQuestionsPerRound) {
      // Fallback: include all domains if not enough questions
      filtered = MASTER_QUESTIONS.filter((q) => q.difficulty === difficulty);
    }

    // Adaptive: after round 1, prioritize weaker domains
    if (round > 1) {
      filtered = filtered.sort((a, b) => scores[a.domain] - scores[b.domain]);
    }

    const selected = shuffle(filtered).slice(0, totalQuestionsPerRound);
    setQuestions(selected);
    setCurrentIndex(0);
    setTimeLeft(300);
    setIsAnswered(false);
    setSelectedOption(null);
  }, [round, stage]);

  /* ======================
     Timer Logic
  ======================= */
  useEffect(() => {
    if (stage !== "quiz" || completed || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, completed, questions.length, stage]);

  /* ======================
     Handle Answer
  ======================= */
  const handleOptionClick = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.answer;

    if (isCorrect) {
      setScores((prev) => ({
        ...prev,
        [currentQuestion.domain]: prev[currentQuestion.domain] + currentQuestion.weight,
      }));
    }

    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  /* ======================
     Next Question / Round
  ======================= */
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      if (round < maxRounds) {
        setRound(round + 1);
      } else {
        setCompleted(true);
        setStage("results");
      }
    }
  };

  /* ======================
     Results Logic
  ======================= */
  const sortedDomains = Object.entries(scores)
    .filter(([domain]) => selectedDomains.includes(domain)) // Only show selected domains
    .sort((a, b) => b[1] - a[1])
    .map(([domain, score]) => ({ domain, score }));

  const bestDomain = sortedDomains[0]?.domain || selectedDomains[0] || "tech";
  const bestDomainName = domainInfo[bestDomain]?.name || "Unknown";

  const improvementMap = {
    tech: "Master DSA, system design, and build real-world projects on GitHub.",
    data: "Deepen SQL, Python (Pandas/NumPy), statistics, and work on Kaggle datasets.",
    ai: "Strengthen deep learning (PyTorch/TensorFlow), math (linear algebra), and deploy models.",
    cloud: "Get hands-on with AWS/GCP, Docker, Kubernetes, Terraform, and CI/CD pipelines.",
    business: "Improve communication, stakeholder management, OKRs, and product strategy thinking.",
  };

  /* ======================
     RENDER: DOMAIN SELECTION SCREEN
  ======================= */
  if (stage === "selection") {
    return (
      <div className="quiz-container domain-selection">
        <div className="selection-card">
          <h1>🎯 Choose Your Career Interests</h1>
          <p className="subtitle">
            Select one or more domains you're interested in. The quiz will focus on these areas.
          </p>

          <div className="domains-grid">
            {Object.entries(domainInfo).map(([key, info]) => (
              <button
                key={key}
                className={`domain-btn ${selectedDomains.includes(key) ? "selected" : ""}`}
                onClick={() => toggleDomain(key)}
                style={{
                  borderColor: selectedDomains.includes(key) ? info.color : "#e2e8f0",
                }}
              >
                <span className="domain-emoji">{info.icon}</span>
                <h3>{info.name}</h3>
                <p>Explore this path</p>
                {selectedDomains.includes(key) && <span className="check">✓</span>}
              </button>
            ))}
          </div>

          <div className="actions">
            <button
              className="primary-btn large"
              onClick={startQuiz}
              disabled={selectedDomains.length === 0}
            >
              Start Personalized Quiz ({selectedDomains.length} selected)
            </button>
          </div>

          <p className="note">
            You can select multiple domains • Quiz adapts to your choices
          </p>
        </div>
      </div>
    );
  }

  /* ======================
     RENDER: RESULTS SCREEN
  ======================= */
  if (stage === "results") {
    return (
      <div className="quiz-container">
        <div className="quiz-result">
          <h1>🎉 Career Readiness Report</h1>
          <p className="subtitle">Based on your selected interests and performance</p>

          <div className="highlight-card" style={{ borderColor: domainInfo[bestDomain].color }}>
            <h2>🏆 Top Recommended Path</h2>
            <h3>{bestDomainName}</h3>
            <p className="score-highlight">{sortedDomains[0]?.score || 0} points</p>
          </div>

          <h3>Your Performance in Selected Domains</h3>
          <div className="score-grid">
            {sortedDomains.map(({ domain, score }, i) => (
              <div key={domain} className={`score-card ${i === 0 ? "winner" : ""}`}>
                <div className="domain-icon" style={{ background: domainInfo[domain].color }}>
                  {domainInfo[domain].icon}
                </div>
                <h4>{domainInfo[domain].name}</h4>
                <div className="score-bar">
                  <div
                    className="fill"
                    style={{
                      width: `${(score / (maxRounds * 3 * 15)) * 100}%`,
                      background: domainInfo[domain].color,
                    }}
                  />
                </div>
                <p>{score} points</p>
              </div>
            ))}
          </div>

          <div className="improvement-section">
            <h3>Next Steps to Excel in {bestDomainName}</h3>
            <p>{improvementMap[bestDomain]}</p>
          </div>

          <div className="actions">
            <button className="primary-btn" onClick={() => window.location.reload()}>
              Retake Quiz
            </button>
            <button
              className="secondary-btn"
              onClick={() => (window.location.href = "/predict")}
            >
              Generate Full Career Report →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ======================
     RENDER: QUIZ IN PROGRESS
  ======================= */
  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return <div className="quiz-container">Preparing your personalized quiz...</div>;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <div className="header-top">
          <h2>Career Intelligence Assessment</h2>
          <div className="timer urgent">{formatTime(timeLeft)}</div>
        </div>

        <div className="progress-info">
          <p>
            Round <strong>{round}</strong>/3 ({getDifficultyByRound(round).toUpperCase()})
            {" • "} Question <strong>{currentIndex + 1}</strong> of {questions.length}
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="selected-domains-hint">
          Focused on: {selectedDomains.map(d => domainInfo[d].icon).join(" ")}
        </div>
      </header>

      <div className="quiz-card">
        <h3 className="question">{currentQuestion.q}</h3>

        <div className="options-grid">
          {currentQuestion.options.map((option, i) => {
            const isCorrect = isAnswered && option === currentQuestion.answer;
            const isWrong = isAnswered && selectedOption === option && !isCorrect;

            return (
              <button
                key={i}
                className={`option-btn 
                  ${isAnswered ? (isCorrect ? "correct" : isWrong ? "wrong" : "disabled") : "active"}
                `}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                {option}
                {isAnswered && isCorrect && <span className="check">✓</span>}
                {isAnswered && isWrong && <span className="cross">✗</span>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="feedback">
            {selectedOption === currentQuestion.answer ? (
              <p className="correct-feedback">Correct! +{currentQuestion.weight} pts</p>
            ) : (
              <p className="wrong-feedback">
                Incorrect. Correct: <strong>{currentQuestion.answer}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="quiz-footer">
        <p className="note">
          Personalized quiz • No skipping • Time-bound
        </p>
      </footer>
    </div>
  );
}