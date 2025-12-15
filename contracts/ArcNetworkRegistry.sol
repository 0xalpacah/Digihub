// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ArcNetworkRegistry
 * @dev Registry contract for Arc Network blog metrics and community data
 * Stores on-chain statistics about the Arc Network ecosystem
 */

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

contract ArcNetworkRegistry {
    // ============ State Variables ============
    
    address public owner;
    
    // USDC on Arc Network
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b3EA6957D0f;
    
    // Registry of blog contributors
    struct Contributor {
        address wallet;
        string name;
        string role;
        uint256 joinedAt;
        bool active;
    }
    
    // Registry of Arc Network projects
    struct Project {
        string name;
        string description;
        address creator;
        string url;
        uint256 createdAt;
        bool featured;
    }
    
    // Network metrics snapshot
    struct NetworkSnapshot {
        uint256 timestamp;
        uint256 blockNumber;
        uint256 gasPrice;
        uint256 activeNodes;
        string networkStatus;
    }
    
    // Storage
    mapping(address => Contributor) public contributors;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => NetworkSnapshot) public snapshots;
    
    address[] public contributorList;
    uint256 public projectCount;
    uint256 public snapshotCount;
    
    // ============ Events ============
    
    event ContributorAdded(address indexed wallet, string name, string role);
    event ContributorRemoved(address indexed wallet);
    event ProjectCreated(uint256 indexed projectId, string name, address creator);
    event ProjectFeatured(uint256 indexed projectId, bool featured);
    event SnapshotRecorded(uint256 indexed snapshotId, uint256 blockNumber, uint256 gasPrice);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============ Contributor Functions ============
    
    /**
     * @dev Add a new contributor to the registry
     */
    function addContributor(
        address _wallet,
        string memory _name,
        string memory _role
    ) external onlyOwner {
        require(_wallet != address(0), "Invalid address");
        require(bytes(_name).length > 0, "Name required");
        
        if (!contributors[_wallet].active) {
            contributorList.push(_wallet);
        }
        
        contributors[_wallet] = Contributor({
            wallet: _wallet,
            name: _name,
            role: _role,
            joinedAt: block.timestamp,
            active: true
        });
        
        emit ContributorAdded(_wallet, _name, _role);
    }
    
    /**
     * @dev Remove a contributor from the registry
     */
    function removeContributor(address _wallet) external onlyOwner {
        require(contributors[_wallet].active, "Contributor not found");
        contributors[_wallet].active = false;
        emit ContributorRemoved(_wallet);
    }
    
    /**
     * @dev Get all active contributors
     */
    function getContributors() external view returns (Contributor[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < contributorList.length; i++) {
            if (contributors[contributorList[i]].active) {
                count++;
            }
        }
        
        Contributor[] memory active = new Contributor[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < contributorList.length; i++) {
            if (contributors[contributorList[i]].active) {
                active[index] = contributors[contributorList[i]];
                index++;
            }
        }
        
        return active;
    }
    
    // ============ Project Functions ============
    
    /**
     * @dev Register a new Arc Network project
     */
    function registerProject(
        string memory _name,
        string memory _description,
        string memory _url
    ) external {
        require(bytes(_name).length > 0, "Project name required");
        
        projects[projectCount] = Project({
            name: _name,
            description: _description,
            creator: msg.sender,
            url: _url,
            createdAt: block.timestamp,
            featured: false
        });
        
        emit ProjectCreated(projectCount, _name, msg.sender);
        projectCount++;
    }
    
    /**
     * @dev Feature a project (owner only)
     */
    function featureProject(uint256 _projectId, bool _featured) external onlyOwner {
        require(_projectId < projectCount, "Project not found");
        projects[_projectId].featured = _featured;
        emit ProjectFeatured(_projectId, _featured);
    }
    
    /**
     * @dev Get featured projects
     */
    function getFeaturedProjects() external view returns (Project[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < projectCount; i++) {
            if (projects[i].featured) {
                count++;
            }
        }
        
        Project[] memory featured = new Project[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < projectCount; i++) {
            if (projects[i].featured) {
                featured[index] = projects[i];
                index++;
            }
        }
        
        return featured;
    }
    
    // ============ Network Metrics Functions ============
    
    /**
     * @dev Record a network metrics snapshot
     */
    function recordSnapshot(
        uint256 _blockNumber,
        uint256 _gasPrice,
        uint256 _activeNodes,
        string memory _networkStatus
    ) external onlyOwner {
        snapshots[snapshotCount] = NetworkSnapshot({
            timestamp: block.timestamp,
            blockNumber: _blockNumber,
            gasPrice: _gasPrice,
            activeNodes: _activeNodes,
            networkStatus: _networkStatus
        });
        
        emit SnapshotRecorded(snapshotCount, _blockNumber, _gasPrice);
        snapshotCount++;
    }
    
    /**
     * @dev Get latest network snapshot
     */
    function getLatestSnapshot() external view returns (NetworkSnapshot memory) {
        require(snapshotCount > 0, "No snapshots recorded");
        return snapshots[snapshotCount - 1];
    }
    
    /**
     * @dev Get USDC balance of this contract
     */
    function getUSDCBalance() external view returns (uint256) {
        return IERC20(USDC).balanceOf(address(this));
    }
    
    /**
     * @dev Get USDC total supply
     */
    function getUSDCTotalSupply() external view returns (uint256) {
        return IERC20(USDC).totalSupply();
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 _contributorCount,
        uint256 _projectCount,
        uint256 _snapshotCount,
        uint256 _usdcBalance
    ) {
        uint256 activeContributors = 0;
        for (uint256 i = 0; i < contributorList.length; i++) {
            if (contributors[contributorList[i]].active) {
                activeContributors++;
            }
        }
        
        return (
            activeContributors,
            projectCount,
            snapshotCount,
            IERC20(USDC).balanceOf(address(this))
        );
    }
}
