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
                        sh 'mvn clean install -DskipTests=true'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    script {
                        sh 'npm install'
                        sh 'ng build --prod'
                    }
                }
            }
        }

        stage('Dockerize Backend') {
            steps {
                script {
                    sh 'docker build -t ${DOCKER_IMAGE_BACKEND} ./backend'
                }
            }
        }

        stage('Dockerize Frontend') {
            steps {
                script {
                    sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} ./frontend'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}'
                    sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${EC2_INSTANCE} << 'EOF'
                            cd /home/ubuntu/EmployeeMgmt
                            docker-compose down
                            docker-compose pull
                            docker-compose up -d
                            EOF
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                node {
                    echo "Cleaning up local Docker resources..."
                    sh 'docker system prune -f || true'
                }
            }
        }
        success {
            echo "Deployment succeeded!"
        }
        failure {
            echo " Deployment failed. Check the logs above."
        }
    }
}
