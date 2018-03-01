import * as React from 'react';

export class Menu extends React.Component<MenuProps, MenuState> {
    render() {
        return (
            <header className="app__header">
                <div className="app__burger">Burger</div>
            </header>
        );
    }
}

interface MenuProps {

}


interface MenuState {

}