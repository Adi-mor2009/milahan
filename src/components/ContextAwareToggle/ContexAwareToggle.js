import { useContext } from "react";
import { AccordionContext, Button, useAccordionToggle } from "react-bootstrap";

export default function ContextAwareToggle({ children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
        <Button variant="link" onClick={decoratedOnClick}>{children}
            {isCurrentEventKey && <i class="bi bi-chevron-up style={{ fontWeight: 'bold' }}"></i>}
            {!isCurrentEventKey && <i class="bi bi-chevron-down style={{ fontWeight: 'bold' }}"></i>}
        </Button>
    );
}