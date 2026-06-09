import os
import requests

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("AVIATIONSTACK_API_KEY")



def search_flights(query):
    url = "http://api.aviationstack.com/v1/flights"
    
    params = {
        "access_key":API_KEY,
        "limit": 5
    }
    
    response = requests.get(url , params=params)
    
    data = response.json()
    
    flights = []
    
    if "data" in data:
        for flight in data["data"][:5]:
            
            airline = flight.get("airline" ,{}).get("name" ,"unknown")
            
            departure = flight.get(
                "departure",{} 
            ).get("airport", "unknown")
            
            arrival = flight.get("arrival",{}).get("airport", "unknown")
            
            status = flight.get("flight_status" , "unknown")
            
            flights.append(f"""
                Airline: {airline}
                Depatture : {departure}
                Arrival : {arrival}
                Status : {status}
                """)