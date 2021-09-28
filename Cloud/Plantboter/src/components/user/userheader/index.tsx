import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter, IonSelect, IonSkeletonText } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useState } from 'react';

interface ContainerProps { }

const UserHeader: React.FC<ContainerProps> = () => {
    const [email, set_email] = useState('');
    const [created_at, set_created_at] = useState<Date>();
    const [updated_at, set_updated_at] = useState<Date>();
    const [active, set_active] = useState(null);
    const [admin, set_admin] = useState(null);

    useIonViewDidEnter(() => {
        api.getUser()
            .then((user) => {
                set_email(user.data.user.email);
                set_created_at(new Date(user.data.user.created_at));
                set_updated_at(new Date(user.data.user.updatedAt));
                set_active(user.data.user.email_confirmed);
                set_admin(user.data.user.admin);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return (
        <IonCard class="user-card">
            <IonCardHeader>
                <IonCardTitle>User: {!email ? <><IonSkeletonText animated style={{ width: "200px" }}></IonSkeletonText></> : email}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>
                    User Status: {active == null ? <><IonSkeletonText animated style={{ width: "50px" }}></IonSkeletonText></> : (active ? "Active" : "Inactive")}
                </p>
                <p>
                    Admin: {admin == null ? <><IonSkeletonText animated style={{ width: "50px" }}></IonSkeletonText></> : (admin ? "True" : "False")}
                </p>
            </IonCardContent>
            <IonCardContent>
                <p>
                    User Singnup:
                    {
                        !created_at ?
                            <>
                                <IonSkeletonText animated style={{ width: "200px" }}></IonSkeletonText>
                            </> :
                            ' ' + created_at.getDay().toString() + ' ' + monthNames[created_at.getMonth()] + ' ' + created_at.getFullYear()
                    }
                </p>
                <p>
                    Last Update: 
                    {
                        !updated_at ?
                            <>
                                <IonSkeletonText animated style={{ width: "200px" }}></IonSkeletonText>
                            </> :
                            ' ' + updated_at.getDay().toString() + ' ' + monthNames[updated_at.getMonth()] + ' ' + updated_at.getFullYear()
                    }
                </p>

            </IonCardContent>

        </IonCard>
    );
};

export default UserHeader;
