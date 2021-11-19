import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';

interface Props {
    onLeftArrow: () => void;
    onRightArrow: () => void;
    disabledLeft: boolean;
    disabledRight: boolean
}

export function ArrowButtons({ onLeftArrow, onRightArrow, disabledLeft, disabledRight}: Props) {
    return (
        <div style={{ position: 'absolute', right: '20px', top: '17px'}}>
            <ButtonGroup>
                <Button
                    onClick={onLeftArrow}
                    disabled={disabledLeft}
                    size="sm"
                    variant="outline-secondary">
                    <ArrowLeft />
                </Button>
                <Button
                    onClick={onRightArrow}
                    disabled={disabledRight}
                    size="sm"
                    variant="outline-secondary">
                    <ArrowRight />
                </Button>
            </ButtonGroup>
        </div>
    )
}