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
                echo 'Building client and server containers...'
                sh 'docker compose build'
            }
        }

        stage('Deploy / Run Stack') {
            steps {
                echo 'Cleaning up old containers and starting fresh stack...'
                sh '''
                    # Stop previous compose stack
                    docker compose down --remove-orphans || true

                    # Ensure no conflicting containers exist
                    docker rm -f devops-mongodb devops-server devops-client 2>/dev/null || true

                    # Start containers in detached mode
                    docker compose up -d
                '''
            }
        }
    }
}
