import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import AnimateHeight from 'react-animate-height';
import "./WUCard.css";
import { cardType, cardSet, totalCardsPerWave, cardSetIcons } from '../data/index';
import { auth } from 'firebase';
import ObjectiveScoreTypeIcon from './ObjectiveScoreTypeIcon';

export const getWUCardByIdFromDB = (cardId, cardPersonalNumber, card, isAlter, toggleCardInDeck, inDeck) => {
    const { name, type, set, scoreType } = card;
    return <WUCard key={cardId} 
                id={cardId} 
                cardPN={cardPersonalNumber} 
                name={name} 
                type={type} 
                set={set}
                scoreType={scoreType} 
                isAlter={isAlter}
                inDeck={inDeck}
                toggleCardInDeck={toggleCardInDeck}
                readonly={false} />;
}

export const getReadOnlyWUCardByIdFromDb = (cardId, cardPersonalNumber, card, isAlter) => {
    const { name, type, set, scoreType } = card;
    return <WUCard readonly 
                inDeck
                key={cardId} 
                id={cardId} 
                cardPN={cardPersonalNumber} 
                name={name} 
                type={type} 
                set={set} 
                scoreType={scoreType}
                isAlter={isAlter} />;
}

const styles = theme => ({
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
      },

    expandOpen: {
        transform: 'rotate(180deg)',
    },

    addButton: {
        position: 'absolute', 
        top: '1rem', 
        right: '0px', 
        width: "2rem", 
        height:'2rem', 
        borderRadius:'1rem',
        color: 'white',
        display: 'flex'
    },

    inTheDeck: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
        backgroundColor: '#3B9979',
    },

    notInTheDeck: {
        backgroundColor: '#8A1C1C',
        transform: 'rotate(45deg)',
    }
});

const colorsTable = [
    '#3E5E5F',
    // '#581F19',
    // '#181D57',
    '#321B3F',
    '#38461A',
    '#985519',
    '#61411A',
    '#8A1C1C',
    '#1A3965',
    
]

class WUCardAtom extends Component {
    state = { 
        expanded: false, 
        color: 0, 
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded, color: state.color + 1 === colorsTable.length ? 0 : state.color + 1 }));
    };

    handleToggleCardInDeck = () => {
        this.props.toggleCardInDeck(this.props.id, this.props.type, this.props.name, this.props.set);
    }

    render() {
        const { classes, type, id, scoreType } = this.props;
        const height = this.state.expanded ? 'auto' : 0;
        const icons = ['objective-icon', 'ploy-icon', 'upgrade-icon', 'gambit spell-icon'];
        return (
            <div className={`root ${this.props.isAlter ? 'alternateRootColor' : ''}`}>
                <div className="header">
                    <div style={{position: 'relative'}}>
                        <Avatar className="typeicon headerItem" src={`/assets/icons/${icons[type]}.png`} />
                        {
                            !this.props.readonly &&
                            <ButtonBase className={classnames(classes.addButton, classes.inTheDeck, {[classes.notInTheDeck]: this.props.inDeck})} 
                                        style={{ border:`.1rem solid ${this.props.isAlter ? '#E0F3EC' : 'white'}` }}
                                        onClick={this.handleToggleCardInDeck}>
                                <AddIcon style={{width: '1.2rem', margin: 'auto'}} />
                            </ButtonBase>
                        }
                    </div>
                    <div className="headerText headerItem">
                        <Typography variant="body2" style={{color: colorsTable[this.props.set]}}>{this.props.name}</Typography>
                        <div style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center'}}>
                            <div style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', margin: '0 .4rem 0 0'}}>
                                <Typography variant="body2" color="textSecondary">
                                    {`${cardType[this.props.type]}`}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    { scoreType >= 0 && <ObjectiveScoreTypeIcon type={scoreType} style={{ width: '1.2rem', height: '1.2rem', margin: '.3rem 0 0 .2rem'}} /> }
                                </Typography>
                            </div>

                            <Typography variant="display1" color="textSecondary" style={{margin: '0 .4rem 0 0'}}>
                                &middot;
                            </Typography>
                            <div style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', margin: '0 .4rem 0 0'}}>
                                <Typography variant="body2" color="textSecondary">
                                    {` Set: `}
                                </Typography>
                                <img style={{width: '1rem', height: '1rem', marginLeft: '.2rem'}} src={`/assets/icons/${cardSetIcons[this.props.set]}-icon.png`} />
                            </div>
                            <Typography variant="display1" color="textSecondary" style={{margin: '0 .4rem 0 0'}}>
                                &middot;
                            </Typography>
                            <div style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', margin: '0 .4rem 0 0'}}>
                                <Typography variant="body2" color="textSecondary">
                                    {`${this.props.cardPN}/${totalCardsPerWave[parseInt(id.slice(0,2), 10)]}`}
                                </Typography>
                                <img style={{width: '1rem', height: '1rem', marginLeft: '.2rem'}} src={`/assets/icons/wave-${id.slice(0,2)}-icon.png`} />
                            </div>
                            {/*  */}
                        </div>
                    </div>
                    <IconButton
                        className={classnames(classes.expand, {[classes.expandOpen]: this.state.expanded, })}
                        onClick={this.handleExpandClick}>
                        <ExpandMoreIcon />
                    </IconButton>
                </div>
                <AnimateHeight 
                    duration={ 175 }
                    height={ height } // see props documentation bellow
                    >
                    <img className="cardImg" alt={this.props.cardN} src={`/assets/cards/${this.props.id}.png`} />
                    {/* <Image 
                        style={{ marginBottom: 10 }}
                        src={`assets/cards/${this.props.img}`} 
                        responsive /> */}
                </AnimateHeight>
            </div>
        );
    }
}

const WUCard = withStyles(styles)(WUCardAtom);
