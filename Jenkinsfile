pipeline {
        agent any

        environment {
                SECRET_KEY = 'secret-key-env'
                MONGODB_URI = 'mongodb://localhost:27017/whispering-database'
                SERVER_PORT = '3000'
                SALT_ROUNDS = '10'
                JWT_SECRET = 'Tu1fefo3mgregO0PcAvjq^q3wQee3f24BXNI8$4r9R'
                DEV_EMAIL = 'dev@example.com' // Replace with actual dev email
        }

        stages {
                stage('Create .env File') {
                        steps {
                                script {
                                        // Create the .env file with the environment variables
                                        writeFile file: '.env', text: """
                                                SECRET_KEY=${SECRET_KEY}
                                                MONGODB_URI=${MONGODB_URI}
                                                SERVER_PORT=${SERVER_PORT}
                                                SALT_ROUNDS=${SALT_ROUNDS}
                                                JWT_SECRET=${JWT_SECRET}
                                                """
                                }
                        }
                }

                stage('Start Docker Compose') {
                        steps {
                                script {
                                        // Run Docker Compose to start services
                                        sh 'npm run compose:up'
                                }
                        }
                }

                // stage('Run Tests') {
                //         steps {
                //                 script {
                //                         try {
                //                                 // Run the tests
                //                                 sh 'npm run test'
                //                         } catch (Exception e) {
                //                                 currentBuild.result = 'FAILURE'
                //                                 throw e
                //                         }
                //                 }
                //         }
                // }

                stage('Start Server') {
                        when {
                                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
                        }
                        steps {
                                script {
                                        // Start the server
                                        sh 'npm start'
                                }
                        }
                }
        }

        post {
                success {
                        script {
                                // Send success feedback to dev via email
                                emailext (
                                        subject: 'Jenkins Pipeline Success: Application Deployed',
                                        body: 'The Jenkins pipeline has successfully completed. The application is running.',
                                        to: DEV_EMAIL
                                )
                        }
                }

                failure {
                        script {
                                // Send failure feedback to dev via email
                                emailext (
                                        subject: 'Jenkins Pipeline Failed: Application Deployment',
                                        body: 'The Jenkins pipeline has failed. Please check the logs for details.',
                                        to: DEV_EMAIL
                                )
                        }
                }
        }
}
