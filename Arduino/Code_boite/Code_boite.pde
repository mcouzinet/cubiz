#include <SPI.h>
#include <Ethernet.h>
#include <Client.h>
// Adresse IP du serveur et Port d'écoute
// 10,2,11,10  10,2,67,217   92.243.19.190
byte server[] = {10,2,66,31};
#define PORT 3000

// Définition des attributs
byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = {10, 2, 66, 30 };
byte gateway[] = {10,2,66,1}; 
Client client(server, PORT);
char buffer[10];

//déclaration des variables pour le lecteur RFID
int tagMem[11];
boolean goPrint = false;

void setup() {
  Serial.begin(9600);
  Ethernet.begin(mac, ip, gateway);
}

void loop() {
  int cnt=0;
  while (Serial.available()>0) {
    tagMem[cnt] = Serial.read();
    cnt++;
    if (cnt == 11) {
      goPrint = true;
      break;
    }
  }
  if (goPrint==true) { 
    if (isTagOK()==true) {
        //envoie HTTP
        sendID();
     }    
    goPrint = false;
  }
  Serial.flush();
  delay(3000);
}

// vérifie que le tag est valide
boolean isTagOK() {
  if ((tagMem[0]==1) && (tagMem[1]==11)  && (tagMem[8]==255)) {
    return true;
  } 
  else {
    return false;
  }
}

//affichage sur le port série
void printTag() {
  for (int i=0; i<11; i++) {
    Serial.print(tagMem[i]); 
  }
  Serial.println("");
}

//Envoie de du taf RFID vers le server
int sendID() {
  if (client.connect()) 
  {
    Serial.println("Connection & envoie");
    //affichage sur le port série
    //printTag();
    sprintf(buffer,"{\"rfid\" : \"%x%x%x%x%x%x%x%x%x%x\"}",tagMem[0],tagMem[1],tagMem[2],tagMem[3],tagMem[4],tagMem[5],tagMem[6],tagMem[7],tagMem[8],tagMem[9]); 
    Serial.println(buffer);   
    client.print("POST / HTTP/1.1\n");
    client.print("Host: http://www.cubiz.fr:3000\n");
    client.println("Content-Type:application/json");
    client.println("Cache-control: no-cache");
    client.print("Content-Length: ");
    client.println(strlen(buffer),DEC);
    client.println();
    client.println(buffer);
    client.println();
  }
  else
  {
     return -1; 
  }
  client.stop();
  return 0;
}
