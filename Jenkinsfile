pipeline {
    agent {
        node {
            label 'rootless-docker'
        }
    }

    stages {
        stage('Prepare Environment') {
            steps {
                echo 'Preparing environment files...'
                sh '''
                    touch server/.env
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building client and server containers with Docker Compose...'
                sh 'docker compose build'
            }
        }

        stage('Deploy / Run Stack') {
            steps {
                echo 'Stopping old containers and deploying fresh stack...'
                sh '''
                    # Stop previous stack if active
                    docker compose down --remove-orphans || true

                    # Ensure no conflicting containers exist
                    docker rm -f devops-mongodb devops-server devops-client 2>/dev/null || true

                    # Start the new stack in detached mode
                    docker compose up -d
                '''
            }
        }
    }
}
