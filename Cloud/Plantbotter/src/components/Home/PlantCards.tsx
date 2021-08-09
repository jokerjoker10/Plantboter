import './PlantCards.css';
import { IonCard, IonCardTitle, IonContent, IonHeader, IonCardHeader, IonTitle, IonToolbar, IonCardContent,IonGrid,IonCol, useIonViewDidEnter } from '@ionic/react';
import {getAllController, getLog, getLang, controller, plant} from '../../scripts/superStore';
import {getLastContact, getLogRedirect, loadImg, getLastSensorValue, getAllPlants} from '../../scripts/utils'
import React, { useState} from 'react';

interface ContainerProps { 
    controller: Promise<Array<controller>>;
}

var lang = getLang();

const PlantCards: React.FC<ContainerProps> = ({controller}) => {
    const [controllers, setControllers] = React.useState<Array<controller>>([]);
    
    React.useEffect(() => {
        controller.then(data => setControllers(data));
    }, []);

    return(
        <div className="HomeGrid">
            {
                controllers.map((data, index) => (
                    data.plants.map((plant, index) => (
                        <IonCard key={index} className="plantCard" href={getLogRedirect(plant.log)}>
                            {loadImg(plant)}
                            <IonCardHeader>
                                <IonCardTitle>{plant.name}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>{/*
                                <p>{lang.home.LastContactText}{getLastContact(plant.log)}</p>
                                <p>{lang.home.DrynessText}{getLastSensorValue(plant.log)}%</p> */}
                            </IonCardContent>
                        </IonCard>
                    ))
                ))
            }
        </div>
    )
};

export default PlantCards;

