import React, { useEffect, useState } from 'react'
import styles from './DocsCard.css'

export const DocsCard = ({ label, imgSrc, link, height = 40, width = 40, title }) => {
    const kubernetesSvg = '/img/setup/icons/kubernetes.svg'

    const imagePath = imgSrc.includes('kubernetes') ? kubernetesSvg : `/img/setup/icons/${imgSrc}.svg`

    const description = {
        "Try Paybill": "Try out Paybill with single docker command",
        "Choose Your Paybill": "Important information on which version of Paybill to use.",
        "System Requirements": "Learn about system requirements for running Paybill",
        DigitalOcean: "Quickly deploy Paybill using the Deploy to DigitalOcean button",
        Docker: "Deploy Paybill on a server using docker-compose",
        Heroku: "Deploy Paybill on Heroku using the one-click-deployment button",
        "AWS AMI": "Deploy Paybill on AWS AMI instances",
        "AWS ECS": "Deploy Paybill on AWS ECS instances",
        Openshift: "Deploy Paybill on Openshift",
        Helm: "Deploy Paybill with Helm Chart",
        Kubernetes: "Deploy Paybill on a Kubernetes cluster",
        "Kubernetes (GKE)": "Deploy Paybill on a GKE Kubernetes cluster",
        "Kubernetes (AKS)": "Deploy Paybill on a AKS Kubernetes cluster",
        "Kubernetes (EKS)": "Deploy Paybill on a EKS Kubernetes cluster",
        "Azure container apps": "Deploy Paybill on a Azure Container Apps",
        "Google Cloud Run": "Deploy Paybill on Cloud Run with GCloud CLI",
        "Deploying Paybill client": "Deploy Paybill Client on static website hosting services",
        "Environment variables": "Environment variables required by Paybill Client and Server to start running",
        "Connecting via HTTP proxy": "Environment variables required by Paybill to connect via HTTP proxy",
        "Deploying Paybill on a subpath": "Steps to deploy Paybill on a subpath rather than root of domain",
    }

    return (
        <a href={link} className="card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card-body">
                <div className="card-icon">
                    <img className='img' src={imagePath} width="100%" />
                </div>
                <div className="card-info">
                    <h3 style={{ margin: "0", paddingBottom: "0.5rem" }}>{label}</h3>
                    <p style={{ textAlign: "center" }}>
                        {description[label]}
                    </p>
                </div>
            </div>
        </a>
    )
}
