import React, { Component } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

class Event extends Component {
    state = {
        showDetails: false,
    }

    handleClick = () => {
        this.setState({ showDetails: !this.state.showDetails })
    }

    getData() {
       const event = this.props.event;
       console.log(event);
       let data = [];
       if (event.rsvp_limit) {
           const free = event.rsvp_limit - event.yes_rsvp_count;
           data.push(
                {
                    name: "reservations",
                    value: event.yes_rsvp_count
                },
                {
                    name: "free",
                    value: free

                }
            );
       }
       return data;
    }

    render() {
        let event = this.props.event,
            address = "Event's location not available. Please contact the event's organizer.",
            button = "Show details",
            details = "hideDetails";
        if (this.state.showDetails) { details = "showDetails"; button = "Hide details" } else { details = "hideDetails"; button = "Show details" };
        if (event.venue) {
            address = event.venue.name + ", " + event.venue.address_1 + ", " + event.venue.city + ", " + event.venue.localized_country_name
        };
        const data = this.getData();
        const colors = ["#9c2222", "#ccc"];
        return (
            <div className="Event">
                <div className="eventDate">{event.local_time} - {event.local_date}</div>
                <div className="eventName">{event.name} </div>
                <div className="groupName">{event.group.name} </div>
                <div className="going">{event.yes_rsvp_count} people are going</div>
                { event.rsvp_limit &&
                    <PieChart height={140} width={400}>
                        <Pie data={data} cx={75} cy={75} innerRadius={30} outerRadius={40} fill="#8884d8" label>{
                            data.map((entry, index) => <Cell fill={colors[index % colors.length]} />)}
                        </Pie>
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                        <Tooltip />
                    </PieChart>
                }
                <div className={details}>
                    <p className="address" >{address} </p>
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                    <a className="link" target="_blank" href={event.link}>Event Link</a>
                </div>
                <button className="details-btn" onClick={this.handleClick}>{button} </button>
            </div>
        );
    }
}

export default Event;