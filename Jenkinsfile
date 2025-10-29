pipeline {
    agent any

    environment {
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
                git branch: 'main', url: 'https://github.com/amalashwetah221-droid/EmployeeMgmt.git'
            }
        }

        stage('Build Backend') {
            tools { maven 'M3' } 
            steps {
                dir(BACKEND_DIR) {
                    sh 'mvn clean install -DskipTests=true'
                }
            }
        }


        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    sh 'npm install'
                    sh 'ng build --prod'
                }
            }
        }

        stage('Dockerize and Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-access-key-id',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    script {
                        sh '''
                            echo "Building backend Docker image..."
                            docker build -t ${DOCKER_IMAGE_BACKEND} ./backend

                            echo "Building frontend Docker image..."
                            docker build -t ${DOCKER_IMAGE_FRONTEND} ./frontend

                            echo "Pushing images to Docker Hub..."
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}
                        '''
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
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

    post {
        always {
            echo "🧹 Cleaning up local Docker images to save space..."
            sh 'docker system prune -f || true'
        }
        success {
            echo "Deployment succeeded!"
        }
        failure {
            echo "Deployment failed — check logs above."
        }
    }
}
