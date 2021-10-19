import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import Auth from './pages/login';
import User from './pages/user';
import Logout from './pages/logout';
import Settings from './pages/settings';
import ControllerSettings from './pages/controllersettings';
import ServerOffline from './pages/serveroffline';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import api from './services/Api';
import Version from './components/version';

const App: React.FC = () => {
  api.healthCheck()
  .then((response) => {
    console.log("Server available");
  })
  .catch((error) => {
    console.log(window.location.pathname)
    if(window.location.pathname != "/serveroffline"){
      window.location.href = "/serveroffline?redirekt=" + encodeURIComponent(window.location.pathname);
    }
  });
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/"><Home /></Route>

          <Route path="/serveroffline" component={ServerOffline}></Route>
          
          <Route path="/auth/:element" component={Auth}></Route>
          <Route path="/user" component={User}></Route>
          <Route path="/logout" component={Logout}></Route>
          <Route path="/settings" component={Settings}></Route>
          <Route path="/settings/:controller" component={ControllerSettings}></Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <Version></Version>
    </IonApp>
  );  
};

export default App;
