pipeline {
    agent any
    environment {
        IMAGE_TAG = "akhilkk03/node-app:${BUILD_NUMBER}"
    }
    stages {
        stage('Clone repo') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_TAG% .'
            }
        }
        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {
                    bat 'docker push %IMAGE_TAG%'
                }
            }
        }
        stage('Update K8s Deployment in GitHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    bat "powershell -Command \"(Get-Content k8s/deployment.yaml) -replace 'image: .*', 'image: %IMAGE_TAG%' | Set-Content k8s/deployment.yaml\""
                    bat 'git config --global user.email "jenkins@ci.com"'
                    bat 'git config --global user.name "Jenkins CI"'
                    bat "git add k8s/deployment.yaml"
                    bat "git commit -m 'Update deployment image to %IMAGE_TAG%'"
                    bat "git push https://%GIT_USER%:%GIT_PASS%@github.com/akhilkk0803/node-app.git main"
                }
            }
        }
    }
}
