pipeline {
    agent any

    stages {
        stage('Setup') {
            steps {
                git branch: 'main', url: 'https://github.com/AdrianoSilva130/exercicio-teste-api-ebac.git'
                bat 'npm install'
            }
        }
               stage('Test') {
            steps {
                bat'start/b npm start'
                bat '''set NO_COLOR=1
npm run
'''
            }
        }
    }
}
