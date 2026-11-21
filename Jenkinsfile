pipeline {
    agent {
        node {
            label 'test-agent'
        }
    }

    stages {
        stage('Prepare Environment') {
            steps {
                echo 'Fetching secrets from Vault and creating server/.env...'
                script {
                    def secrets = [
                        [path: 'secret/devops-ai-chat/dev', engineVersion: 2, secretValues: [
                            [envVar: 'JWT_SECRET_VAL', vaultKey: 'JWT_SECRET'],
                            [envVar: 'GROQ_API_KEY_VAL', vaultKey: 'GROQ_API_KEY']
                        ]]
                    ]
                    def configuration = [
                        vaultUrl: 'http://host.docker.internal:8200',
                        vaultCredentialId: 'vault-devops-ai-chat-approle'
                    ]
                    withVault([configuration: configuration, vaultSecrets: secrets]) {
                        sh '''
                            cat << EOF > server/.env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/devops_ai_chat
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=1d
NODE_ENV=development
GROQ_API_KEY=${GROQ_API_KEY}
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

    post {
        always {
            sh 'rm -f server/.env'
        }
    }
}