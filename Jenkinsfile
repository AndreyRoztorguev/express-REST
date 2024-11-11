pipeline {
    agent any

    environment {
        // Define environment variables if needed
        COMPOSE_FILE = 'docker-compose.yml' // Modify as needed
    }

    stages {
        stage('Start Docker Compose') {
            steps {
                script {
                    // Run Docker Compose to start services in detached mode with build
                    try {
                        sh 'sudo docker-compose up -d --build'
                    } catch (Exception e) {
                        error("Failed to start Docker Compose services: ${e}")
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        failure {
            echo 'Pipeline failed.'
        }
        success {
            echo 'Pipeline succeeded.'
        }
    }
}
