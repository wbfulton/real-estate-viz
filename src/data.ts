export interface PartNumberDatum {
  partNumber: string;
  oldPartNumbers?: string[];
  instancedKeys: string[];
  keys: string[];
  label: string;
  link?: string;
  imageUrls?: string[];
}

// https://partsouq.com/en/catalog/genuine/groups?c=TOYOTA00&ssd=%24%2AKwESJjdGUhNjQWEMTXAxEEpefnlnFhkUFQcoG1NVZnJuamhrLjkVf1FVUWB2b344JS8SG2pmbmUGZysiInNkdAcRERZaDx4PYFoEREMDHARbQFIREhMXAg0GBhADSRoBBHdhc2dpW1tLAkxFBRoBBHEjPVoQEWoKZ2J2YTIhSQwBBFFDAxwEFwIHTA0GBUZIQgZDV1kYXAAAAACjj4Nq%24&vid=0&cid=&q=
export const PartNumberData: PartNumberDatum[] = [
  {
    partNumber: "53301-60320",
    oldPartNumbers: ["53301-60330"],
    instancedKeys: ["Hood"],
    keys: ["hood"],
    label: "Hood",
    imageUrls: [
      "https://partsouq.com/assets/tesseract/assets/global/TOYOTA00/source/53/536403B.gif",
    ],
    link: "https://partsouq.com/en/catalog/genuine/unit?c=TOYOTA00&ssd=%24%2AKwEsGAl4bC1df18yc04PLnRgQEdZKCcqKzkWJW1rWExQVFZVEAcrQW9rb15IUUAGGxEsJVRYUFs4WRUcHE1aSjkvLyhkKQkuPGs6IzxFOjZlKnckLGVna3Z8WjxrNnd7OiMtMzp8Li13JD0tKissOjZlIDs8JTosLSksKnQLd2NhbnB6X2M4JCp3JD86LicuKy93a3k-PXFtPCU4OBcIB19SOjU-PXV5ZXN1PEpCUy8vKFZqDhZOWlNPPDM4ODEqdyQ_dmxyczQ6ZS88ej0iOSwnZQAAAAAdPhnX%24&vid=0&cid=&uid=413457&q=",
  },
  {
    partNumber: "front-bumper",
    instancedKeys: ["Object_3", "Object_4", "Object_5", "Object_"],
    keys: ["Object_8", "Object_8_1", "Object_8_2", "Object_8_3"],
    label: "Front Bumper",
  },
  { partNumber: "Body", instancedKeys: ["Body"], keys: ["body"], label: "Body" },
  {
    partNumber: "passenger-front-rim",
    keys: ["passenger-front-rim"],
    instancedKeys: ["passengerFrontRim"],
    label: "Passenger Front Rim",
  },
  {
    partNumber: "passenger-front-tire",
    instancedKeys: ["Passengerronttire"],
    keys: ["passenger-ront-tire"],
    label: "Passenger Front Tire",
  },
  {
    partNumber: "Passengerrearrim",
    instancedKeys: ["Passengerrearrim"],
    keys: ["passenger-rear-rim"],
    label: "Passenger Rear Rim",
  },
  {
    partNumber: "Passengerreartire",
    instancedKeys: ["Passengerreartire"],
    keys: ["passenger-rear-tire"],
    label: "Passenger Rear Tire",
  },
  {
    partNumber: "Frontlefttire",
    instancedKeys: ["Frontlefttire"],
    keys: ["front-left-tire"],
    label: "Driver Front Tire",
  },
  {
    partNumber: "Driverfrontrim",
    instancedKeys: ["Driverfrontrim"],
    keys: ["driver-front-rim"],
    label: "Driver Front Rim",
  },
  {
    partNumber: "Driverreartire",
    instancedKeys: ["Driverreartire"],
    keys: ["driver-rear-tire"],
    label: "Driver Rear Tire",
  },
  {
    partNumber: "Driverrearrim",
    instancedKeys: ["Driverrearrim"],
    keys: ["driver-rear-rim"],
    label: "Driver Rear Rim",
  },
  {
    partNumber: "Bottomtrim",
    instancedKeys: ["Bottomtrim"],
    keys: ["bottom-trim"],
    label: "Bottom Trim",
  },
  {
    partNumber: "Rearvents",
    instancedKeys: ["Rearvents"],
    keys: ["rear-vents"],
    label: "Rear Vents",
  },
  {
    partNumber: "Roofrack",
    instancedKeys: ["Roofrack"],
    keys: ["roof-rack"],
    label: "Roof rack",
  },
  {
    partNumber: "Miscreartrim",
    instancedKeys: ["Miscreartrim"],
    keys: ["misc-rear-trim"],
    label: "Misc Rear Trim",
  },
  {
    partNumber: "Windshield",
    instancedKeys: ["Windshield"],
    keys: ["windshield"],
    label: "Windshield",
  },
  {
    partNumber: "Windowtrim",
    instancedKeys: ["Windowtrim"],
    keys: ["window-trim"],
    label: "Window Trim",
  },
  {
    partNumber: "Passengermirror",
    instancedKeys: ["Passengermirror"],
    keys: ["passenger-mirror"],
    label: "Passenger Mirror",
  },
  {
    partNumber: "Passengerhandle",
    instancedKeys: ["Passengerhandle"],
    keys: ["passenger-handle"],
    label: "Passenger Door Handle",
  },
  {
    partNumber: "Passengerupperpanel",
    instancedKeys: ["Passengerupperpanel"],
    keys: ["passenger-upper-panel"],
    label: "Passenger Upper Panel",
  },
  {
    partNumber: "Passengerbottompanel",
    instancedKeys: ["Passengerbottompanel"],
    keys: ["passenger-bottom-panel"],
    label: "Passenger Bottom Panel",
  },
  {
    partNumber: "Passengertrim",
    instancedKeys: ["Passengertrim"],
    keys: ["passenger-trim"],
    label: "Passenger Trim",
  },
  {
    partNumber: "Passengerwindow",
    instancedKeys: ["Passengerwindow"],
    keys: ["passenger-window"],
    label: "Passenger Window",
  },
  {
    partNumber: "Driverbottompanel",
    instancedKeys: ["Driverbottompanel"],
    keys: ["driver-bottom-panel"],
    label: "Driver Bottom Panel",
  },
  {
    partNumber: "Driverglass",
    instancedKeys: ["Driverglass"],
    keys: ["driver-glass"],
    label: "Driver Window",
  },
  {
    partNumber: "Leftmirror",
    instancedKeys: ["Leftmirror"],
    keys: ["left-mirror"],
    label: "Driver Mirror",
  },
  {
    partNumber: "Frontlefthandle",
    instancedKeys: ["Frontlefthandle"],
    keys: ["front-left-handle"],
    label: "Driver Door Handle",
  },
  {
    partNumber: "Leftmidtrim",
    instancedKeys: ["Leftmidtrim"],
    keys: ["left-mid-trim"],
    label: "Driver Mid Trim",
  },
  {
    partNumber: "Driverdoor",
    instancedKeys: ["Driverdoor"],
    keys: ["driver-door"],
    label: "Driver Door",
  },
  {
    partNumber: "Driverpanel",
    instancedKeys: ["Driverpanel"],
    keys: ["driver-panel"],
    label: "Driver Panel",
  },
  {
    partNumber: "Passengerreardoor",
    instancedKeys: ["Passengerreardoor"],
    keys: ["passenger-rear-door"],
    label: "Passenger Rear Door",
  },
  {
    partNumber: "Passengerrearhandle",
    instancedKeys: ["Passengerrearhandle"],
    keys: ["passenger-rear-handle"],
    label: "Passenger Rear Door Handle",
  },
  {
    partNumber: "Passengerrearpanel",
    instancedKeys: ["Passengerrearpanel"],
    keys: ["passenger-rear-panel"],
    label: "Passenger Rear Door Panel",
  },
  {
    partNumber: "Passengerbottompanel1",
    instancedKeys: ["Passengerbottompanel1"],
    keys: ["passenger-bottom-panel001"],
    label: "Passenger Bottom Door Panel",
  },
  {
    partNumber: "Passengerreartrim",
    instancedKeys: ["Passengerreartrim"],
    keys: ["passenger-rear-trim"],
    label: "Passenger Rear Trim",
  },
  {
    partNumber: "Passengerrearwindow",
    instancedKeys: ["Passengerrearwindow"],
    keys: ["passenger-rear-window"],
    label: "Passenger Rear Window",
  },
  {
    partNumber: "Driverrearbottompanel",
    instancedKeys: ["Driverrearbottompanel"],
    keys: ["driver-rear-bottom-panel"],
    label: "Driver Rear Bottom Door Panel",
  },
  {
    partNumber: "Driverreartrim",
    instancedKeys: ["Driverreartrim"],
    keys: ["driver-rear-trim"],
    label: "Driver Rear Trim",
  },
  {
    partNumber: "Driverreardoor",
    instancedKeys: ["Driverreardoor"],
    keys: ["driver-rear-door"],
    label: "Driver Rear Door",
  },
  {
    partNumber: "Driverrearhandle",
    instancedKeys: ["Driverrearhandle"],
    keys: ["driver-rear-handle"],
    label: "Driver Rear Door Handle",
  },
  {
    partNumber: "Driverreartoppanel",
    instancedKeys: ["Driverreartoppanel"],
    keys: ["driver-rear-top-panel"],
    label: "Driver Rear Top Door Panel",
  },
  {
    partNumber: "Grill",
    instancedKeys: ["Object99", "Object100"],
    keys: ["Object_156_1", "Object_156_2"],
    label: "Grill",
  },
  {
    partNumber: "Driverrearwindow",
    instancedKeys: ["Driverrearwindow"],
    keys: ["driver-rear-window"],
    label: "Driver Rear Window",
  },
  {
    partNumber: "Frontlefttrim",
    instancedKeys: ["Frontlefttrim"],
    keys: ["front-left-trim"],
    label: "Driver Front Trim",
  },
  {
    partNumber: "Frontleftbottompanel",
    instancedKeys: ["Frontleftbottompanel"],
    keys: ["front-left-bottom-panel"],
    label: "Driver Bottom Door Panel",
  },
  {
    partNumber: "Frontleftpanel",
    instancedKeys: ["Frontleftpanel"],
    keys: ["front-left-panel"],
    label: "Driver Door Panel",
  },
  {
    partNumber: "Leftblinker",
    instancedKeys: ["Leftblinker"],
    keys: ["left-blinker"],
    label: "Driver Blinker",
  },
  {
    partNumber: "Leftheadlight",
    instancedKeys: ["Leftheadlight"],
    keys: ["left-headlight"],
    label: "Driver Headlight",
  },
  {
    partNumber: "Passengerfrontbottompanel",
    instancedKeys: ["Passengerfrontbottompanel"],
    keys: ["passenger-front-bottom-panel"],
    label: "Passenger Bottom Door Panel",
  },
  {
    partNumber: "Passengerfrontupperpanel",
    instancedKeys: ["Passengerfrontupperpanel"],
    keys: ["passenger-front-upper-panel"],
    label: "Passenger Upper Door Panel",
  },
  {
    partNumber: "Passengerfronttrim",
    instancedKeys: ["Passengerfronttrim"],
    keys: ["passenger-front-trim"],
    label: "Passenger Door Trim",
  },
  {
    partNumber: "Rightblinker",
    instancedKeys: ["Rightblinker"],
    keys: ["right-blinker"],
    label: "Passenger Blinker",
  },
  {
    partNumber: "Rightheadlight",
    instancedKeys: ["Rightheadlight"],
    keys: ["right-headlight"],
    label: "Passenger Headlight",
  },
  {
    partNumber: "Exhaust",
    instancedKeys: ["Exhaust"],
    keys: ["exhaust"],
    label: "Exhaust",
  },
  {
    partNumber: "Enginedrivetrain",
    instancedKeys: ["Enginedrivetrain"],
    keys: ["engine-drivetrain"],
    label: "Engine and Drivetrain",
  },
  {
    partNumber: "Reardiffaxle",
    instancedKeys: ["Reardiffaxle"],
    keys: ["rear-diff-axle"],
    label: "Rear Diff and Axel",
  },
  {
    partNumber: "rear-tailight",
    instancedKeys: ["Object120", "Object121", "Object122"],
    keys: ["Object_186", "Object_186_1", "Object_186_2"],
    label: "Rear Tailights",
  },
  {
    partNumber: "Backupperlight",
    instancedKeys: ["Backupperlight"],
    keys: ["back-upper-light"],
    label: "Rear Upper Light",
  },
  {
    partNumber: "Tailgatetrim",
    instancedKeys: ["Tailgatetrim"],
    keys: ["tailgate-trim"],
    label: "Tailgate trim",
  },
  {
    partNumber: "rear-wiper",
    instancedKeys: ["Object126", "Object127"],
    keys: ["Object_192_1", "Object_192_2"],
    label: "Rear Wiper",
  },
  {
    partNumber: "Rearwindow",
    instancedKeys: ["Rearwindow"],
    keys: ["rear-window"],
    label: "Rear Window",
  },
  {
    partNumber: "Tailgate",
    instancedKeys: ["Tailgate"],
    keys: ["tailgate"],
    label: "Tailgate",
  },
  {
    partNumber: "Bumpertrim",
    instancedKeys: ["Bumpertrim"],
    keys: ["bumper-trim"],
    label: "Rear Bumper Trim",
  },
  {
    partNumber: "Rearbumper",
    instancedKeys: ["Rearbumper"],
    keys: ["rear-bumper"],
    label: "Rear Bumper ",
  },
  {
    partNumber: "Bumperlight",
    instancedKeys: ["Bumperlight"],
    keys: ["bumper-light"],
    label: "Rear Bumper Light",
  },
];
