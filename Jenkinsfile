pipeline {
    agent {
        node {
            label 'rootless-docker'
        }
    }

    stages {
        stage('Prepare Environment') {
            steps {
                echo 'Creating server/.env with configuration and secrets...'
                withCredentials([
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET_VAL'),
                    string(credentialsId: 'GROQ_API_KEY', variable: 'GROQ_API_KEY_VAL')
                ]) {
                    sh '''
                        cat << EOF > server/.env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/devops_ai_chat
JWT_SECRET=${JWT_SECRET_VAL}
JWT_EXPIRES_IN=1d
NODE_ENV=development
GROQ_API_KEY=${GROQ_API_KEY_VAL}
GROQ_MODEL=openai/gpt-oss-20b
EOF
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building client and server containers with Docker Compose...'
                sh 'docker compose build'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Logging in and pushing images to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'DOCKERHUB_CREDENTIALS',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        # 1. Login to Docker Hub securely
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        # 2. Tag Client Image (latest and build number)
                        docker tag devops-ai-chat-pipeline-client:latest $DOCKER_USER/devops-ai-chat-client:latest
                        docker tag devops-ai-chat-pipeline-client:latest $DOCKER_USER/devops-ai-chat-client:${BUILD_NUMBER}

                        # 3. Tag Server Image (latest and build number)
                        docker tag devops-ai-chat-pipeline-server:latest $DOCKER_USER/devops-ai-chat-server:latest
                        docker tag devops-ai-chat-pipeline-server:latest $DOCKER_USER/devops-ai-chat-server:${BUILD_NUMBER}

                        # 4. Push Client Images
                        docker push $DOCKER_USER/devops-ai-chat-client:latest
                        docker push $DOCKER_USER/devops-ai-chat-client:${BUILD_NUMBER}

                        # 5. Push Server Images
                        docker push $DOCKER_USER/devops-ai-chat-server:latest
                        docker push $DOCKER_USER/devops-ai-chat-server:${BUILD_NUMBER}

                        # 6. Logout from Docker Hub
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy / Run Stack') {
            steps {
                echo 'Cleaning up old containers and deploying fresh stack...'
                sh '''
                    docker compose down --remove-orphans || true
                    docker rm -f devops-mongodb devops-server devops-client 2>/dev/null || true
                    docker compose up -d
                '''
            }
        }
    }
}
