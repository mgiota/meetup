import React, { Component } from 'react';

class Event extends Component {
    state = {
        showDetails: false,
    }

    handleClick = () => {
        this.setState({ showDetails: !this.state.showDetails })
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
        return (
            <div className="Event">
                <div className="eventDate">{event.local_time} - {event.local_date}</div>
                <div className="eventName">{event.name} </div>
                <div className="groupName">{event.group.name} </div>
                <div className="going">{event.yes_rsvp_count} people are going</div>
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