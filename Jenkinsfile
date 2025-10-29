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
                git "https://github.com/amalashwetah221-droid/EmployeeMgmt.git"
            }
        }

        stage('Build Backend') {
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
                // ✅ Bind username and password to AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
                withCredentials([usernamePassword(credentialsId: 'aws-access-key-id', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        echo "AWS key ID: $AWS_ACCESS_KEY_ID"
                        echo "Building and pushing Docker images..."
                        docker build -t ${DOCKER_IMAGE_BACKEND} ./backend
                        docker build -t ${DOCKER_IMAGE_FRONTEND} ./frontend
                        docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}
                        docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}
                    '''
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
            node {
                echo "Cleaning up local Docker resources..."
                sh 'docker system prune -f || true'
            }
        }
        success {
            echo " Deployment succeeded!"
        }
        failure {
            echo "Deployment failed. Check the logs above."
        }
    }
}
