// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ============================================================
// PrithviLok EcoNFT (Dynamic NFT for Eco Impact)
// ============================================================

contract EcoNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from user wallet coordinate to their token ID
    mapping(address => uint256) public userToTokenId;

    // Mapping from token ID to Eco Level (1: Seed, 2: Sapling, 3: Tree, 4: Forest Guardian)
    mapping(uint256 => uint256) public tokenLevel;

    // Events
    event Minted(address indexed user, uint256 indexed tokenId, uint256 level);
    event Upgraded(address indexed user, uint256 indexed tokenId, uint256 newLevel);

    constructor() ERC721("PrithviLokEco", "PLECO") Ownable(msg.sender) {
        _nextTokenId = 1; // Start IDs at 1
    }

    /**
     * @dev Mint a new Level 1 (Seed) NFT for a user.
     * Can only be called by the platform owner/backend.
     * @param to The wallet address of the user.
     * @param tokenURI The IPFS URI for Level 1 metadata.
     */
    function mintNFT(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        require(userToTokenId[to] == 0, "User already has an EcoNFT");

        uint256 tokenId = _nextTokenId++;
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        userToTokenId[to] = tokenId;
        tokenLevel[tokenId] = 1; // Seed Level

        emit Minted(to, tokenId, 1);
        return tokenId;
    }

    /**
     * @dev Upgrade the user's NFT to a new level by dynamically changing its URI.
     * Can only be called by the platform owner/backend based on the user's eco score.
     * @param user The wallet address of the user.
     * @param newLevel The new level (2, 3, or 4).
     * @param newTokenURI The IPFS URI for the new level's metadata.
     */
    function upgradeNFT(address user, uint256 newLevel, string memory newTokenURI) public onlyOwner {
        uint256 tokenId = userToTokenId[user];
        require(tokenId != 0, "User does not own an EcoNFT");
        require(newLevel > tokenLevel[tokenId], "New level must be higher than current level");
        require(newLevel <= 4, "Maximum level is 4 (Forest Guardian)");

        tokenLevel[tokenId] = newLevel;
        _setTokenURI(tokenId, newTokenURI);

        emit Upgraded(user, tokenId, newLevel);
    }

    /**
     * @dev Get the NFT data for a specific user safely.
     * @param user The wallet address of the user.
     */
    function getNFT(address user) public view returns (uint256 tokenId, uint256 level, string memory uri) {
        tokenId = userToTokenId[user];
        require(tokenId != 0, "User does not own an EcoNFT");
        
        level = tokenLevel[tokenId];
        uri = tokenURI(tokenId);
        
        return (tokenId, level, uri);
    }

    /**
     * @dev Override to prevent transferring this NFT. It is soulbound to the user's environmental impact!
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "EcoNFTs are Soulbound and cannot be transferred.");
        return super._update(to, tokenId, auth);
    }
}
