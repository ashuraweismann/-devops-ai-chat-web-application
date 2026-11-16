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
                    # Ensure server/.env exists so docker compose doesn't fail on missing env_file
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
                echo 'Starting application containers...'
                sh 'docker compose up -d'
            }
        }
    }
}
