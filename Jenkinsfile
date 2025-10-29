pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        REGION = 'ap-south-1'
        EC2_INSTANCE = 'ubuntu@13.201.77.117'  
        DOCKER_REGISTRY = 'docker.io/amala221'
        DOCKER_IMAGE_BACKEND = 'amala221/backend-GU'
        DOCKER_IMAGE_FRONTEND = 'amala221/frontend-GU'
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
    }

    stages {
        stage('Checkout') {
            steps {
                git "https://github.com/amalashwetah221-droid/EmployeeMgmt.git"
            }
        }

        stage('Build Backend') {
            steps {
                dir(BACKEND_DIR) {
                    script {
                        // Build the backend Spring Boot application
                        sh 'mvn clean install -DskipTests=true'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    script {
                        // Install frontend dependencies and build Angular app
                        sh 'npm install'
                        sh 'ng build --prod'
                    }
                }
            }
        }

        stage('Dockerize Backend') {
            steps {
                script {
                    // Build the backend Docker image
                    sh 'docker build -t ${DOCKER_IMAGE_BACKEND} ./backend'
                }
            }
        }

        stage('Dockerize Frontend') {
            steps {
                script {
                    // Build the frontend Docker image
                    sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} ./frontend'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    // Push Docker images to Docker Hub or AWS ECR
                    sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}'
                    sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    // SSH into EC2 and run Docker Compose to deploy the app
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${EC2_INSTANCE} << 'EOF'
                            cd /home/ubuntu/EmployeeMgmt  // Path where your repo is cloned on EC2
                            docker-compose down   # Stop any running containers
                            docker-compose pull   # Pull the latest Docker images
                            docker-compose up -d  # Start the containers in detached mode
                            EOF
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker images to save space
            sh 'docker system prune -f'
        }
    }
}
