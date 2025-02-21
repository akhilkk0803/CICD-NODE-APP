pipeline {
    agent any
    environment {
        IMAGE_TAG = "akhilkk03/node-app:${BUILD_NUMBER}"  // 🔹 Naming convention
    }
    stages {
        stage('Clone repo') {
            steps {
                checkout scm
                bat 'git fetch --all'
                bat 'git checkout master'
                bat 'git reset --hard origin/master'
                bat 'git pull origin master --rebase'
            }
        }
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_TAG% .'  // 🔹 Use BUILD_NUMBER
            }
        }
        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {  // 🔹 Correct credential ID
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
                    bat 'git add k8s/deployment.yaml'
                    bat 'git commit -m "Update deployment image to %IMAGE_TAG%" || echo "No changes to commit"'
                    bat 'git push https://%GIT_USER%:%GIT_PASS%@github.com/akhilkk0803/CICD-NODE-APP.git master'
                }
            }
        }
         stage('Trigger ArgoCD Sync') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'argocd-creds', usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                    bat 'argocd login <ARGOCD_SERVER> --username %ARGOCD_USER% --password %ARGOCD_PASS% --insecure'
                    bat 'argocd app sync node-app'
                }
            }
        }
    }
}
