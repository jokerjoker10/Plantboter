import { IonButtons, IonBackButton , IonHeader, IonPage, IonTitle, IonToolbar, IonContent,  } from '@ionic/react';
import PlantCards from '../components/Home/PlantCards';
import { RouteComponentProps } from 'react-router';
import {getAllController, getLog, getLang, plant, controller} from '../scripts/superStore';

import DisplayLog from '../components/Log/DisplayLog';
import DisplayInfo from '../components/Log/DisplayInfo';
import DisplayChart from '../components/Log/DisplayChart';

import './log.css';
import React, { useState } from 'react';

var lang = getLang();
interface Log extends RouteComponentProps<{id: string;}> {}

  

  const LogPage: React.FC<Log> = ({match}) => {
    const [_plant, setPlant] = useState<plant>();
    const [_controller, setController] = useState<controller>();

    React.useEffect(() => {
      getAllController()
      .then(data => {
        data.forEach(cons => {
          cons.plants.forEach(plant => {
            if(plant.log._id == match.params.id){              
              setPlant(plant);
              setController(cons);
            }
          })
        })
      })
    }, []);

    
    function data(plant: plant|undefined, controller: controller|undefined){
      if(plant != undefined || controller != undefined ){
        return(<>
          <div className="display">
              <div className="info">
                {}
                  <DisplayInfo plant={plant!} controller={controller!}></DisplayInfo>
              </div>
              <div className="chart">
                  <DisplayChart plant={plant!}></DisplayChart>    
              </div>
            </div>
        </>)
      }
      else{
        return(<></>)
      }
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>{lang.log.Title}{_plant?.name} </IonTitle>            
          </IonToolbar>
        </IonHeader>
        <IonContent >
          {data(_plant, _controller!)}
        </IonContent>
      </IonPage>
    );
  };

  export default LogPage;