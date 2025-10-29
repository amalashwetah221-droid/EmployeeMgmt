pipeline {
    agent any

    environment {
        REGION = 'ap-south-1'
        EC2_INSTANCE = 'ubuntu@13.201.77.117'
        DOCKER_REGISTRY = 'docker.io/amala221'
        DOCKER_IMAGE_BACKEND = 'amala221/backend-gu'
        DOCKER_IMAGE_FRONTEND = 'amala221/frontend-gu'
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
                // Check if the JAR file exists
                sh 'ls -l target/'
            }
        }
    }



       stage('Build Frontend') {
         tools { nodejs 'Node20' }
            steps {
                dir(FRONTEND_DIR) {
                    script {
                        sh '''
                            npm config set fetch-retry-maxtimeout 120000
                            npm config set fetch-timeout 120000
                            rm -rf node_modules package-lock.json
                            npm cache clean --force
                            npm install --legacy-peer-deps
                            npm run build --if-present
                        '''
                    }
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
                            docker push ${DOCKER_IMAGE_BACKEND}:latest
                            docker push ${DOCKER_IMAGE_FRONTEND}:latest

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
